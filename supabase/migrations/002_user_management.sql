-- ==============================================================================
-- KKDGMS CORE — Phase 2: Profiles, Roles, User Management & Account Control
-- Migration: 002_user_management.sql
-- Description: Extends profiles, creates roles/permissions architecture, secure administrative RPCs, and avatar storage
-- ==============================================================================

-- 1. Extend Profiles Table with Account Status, Phone, and Login Tracking
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Keep is_active synchronized with status
UPDATE public.profiles 
SET is_active = (status = 'ACTIVE')
WHERE is_active IS DISTINCT FROM (status = 'ACTIVE');

CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- 2. Create Roles Table Architecture
CREATE TABLE IF NOT EXISTS public.roles (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    hierarchy_level INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed System Roles
INSERT INTO public.roles (code, name, description, hierarchy_level, is_active)
VALUES
    ('SUPER_ADMIN', 'Super Administrator', 'Highest institutional and system authority', 100, true),
    ('ADMIN', 'School Administrator', 'School-level administrator managing operations', 80, true),
    ('FACULTY', 'Teaching Faculty', 'Teaching staff managing classes and students', 50, true),
    ('WARDEN', 'Hostel Warden', 'Hostel administrator managing inmates and gate passes', 40, true),
    ('TECHNICIAN', 'Technical Staff', 'IT and technical services staff', 30, true),
    ('STUDENT', 'Student', 'Student accessing personal academic information', 20, true),
    ('GUEST', 'Guest Account', 'Limited guest account for visitors or prospective parents', 10, true)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    hierarchy_level = EXCLUDED.hierarchy_level;

-- 3. Create Permissions and Role-Permissions Foundation Tables
CREATE TABLE IF NOT EXISTS public.permissions (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    module TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_code TEXT REFERENCES public.roles(code) ON DELETE CASCADE,
    permission_code TEXT REFERENCES public.permissions(code) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (role_code, permission_code)
);

-- Seed Initial Core Permissions
INSERT INTO public.permissions (code, name, module, description)
VALUES
    ('VIEW_PROFILE', 'View Own Profile', 'ACCOUNT', 'Ability to view own profile details'),
    ('EDIT_PROFILE', 'Edit Own Profile', 'ACCOUNT', 'Ability to edit own non-sensitive details'),
    ('VIEW_USERS', 'View System Users', 'USER_MANAGEMENT', 'Ability to view user accounts in admin directory'),
    ('EDIT_USERS', 'Edit User Profiles', 'USER_MANAGEMENT', 'Ability to update user information'),
    ('MANAGE_ROLES', 'Assign User Roles', 'USER_MANAGEMENT', 'Ability to assign and modify user roles'),
    ('MANAGE_STATUS', 'Control Account Status', 'USER_MANAGEMENT', 'Ability to activate, deactivate, or suspend accounts'),
    ('VIEW_AUDIT_LOGS', 'View Audit Trail', 'AUDIT', 'Ability to inspect system audit logs')
ON CONFLICT (code) DO NOTHING;

-- Seed Default Role-Permission Assignments
INSERT INTO public.role_permissions (role_code, permission_code)
VALUES
    ('SUPER_ADMIN', 'VIEW_PROFILE'), ('SUPER_ADMIN', 'EDIT_PROFILE'), ('SUPER_ADMIN', 'VIEW_USERS'), ('SUPER_ADMIN', 'EDIT_USERS'), ('SUPER_ADMIN', 'MANAGE_ROLES'), ('SUPER_ADMIN', 'MANAGE_STATUS'), ('SUPER_ADMIN', 'VIEW_AUDIT_LOGS'),
    ('ADMIN', 'VIEW_PROFILE'), ('ADMIN', 'EDIT_PROFILE'), ('ADMIN', 'VIEW_USERS'), ('ADMIN', 'EDIT_USERS'), ('ADMIN', 'MANAGE_ROLES'), ('ADMIN', 'MANAGE_STATUS'), ('ADMIN', 'VIEW_AUDIT_LOGS'),
    ('FACULTY', 'VIEW_PROFILE'), ('FACULTY', 'EDIT_PROFILE'),
    ('WARDEN', 'VIEW_PROFILE'), ('WARDEN', 'EDIT_PROFILE'),
    ('TECHNICIAN', 'VIEW_PROFILE'), ('TECHNICIAN', 'EDIT_PROFILE'),
    ('STUDENT', 'VIEW_PROFILE'), ('STUDENT', 'EDIT_PROFILE'),
    ('GUEST', 'VIEW_PROFILE')
ON CONFLICT DO NOTHING;

-- 4. Secure Administrative RPC Functions

-- Role Update RPC with Strict Hierarchy Enforcement
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
    target_user_id UUID,
    new_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    caller_id UUID := auth.uid();
    caller_role TEXT;
    target_current_role TEXT;
    target_email TEXT;
BEGIN
    -- Verify caller is authenticated
    IF caller_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    -- Get caller's role
    SELECT role INTO caller_role FROM public.profiles WHERE id = caller_id AND is_active = true;
    IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
        RAISE EXCEPTION 'Forbidden: Administrator privileges required to change roles.';
    END IF;

    -- Validate target role
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE code = new_role) THEN
        RAISE EXCEPTION 'Invalid role code provided: %', new_role;
    END IF;

    -- Get target user current profile
    SELECT role, email INTO target_current_role, target_email 
    FROM public.profiles WHERE id = target_user_id;

    IF target_current_role IS NULL THEN
        RAISE EXCEPTION 'User profile not found.';
    END IF;

    -- Safeguard: Only SUPER_ADMIN can assign SUPER_ADMIN or demote a SUPER_ADMIN
    IF (new_role = 'SUPER_ADMIN' OR target_current_role = 'SUPER_ADMIN') AND caller_role <> 'SUPER_ADMIN' THEN
        RAISE EXCEPTION 'Forbidden: Only a Super Administrator can manage Super Admin roles.';
    END IF;

    -- Prevent demoting the last remaining active SUPER_ADMIN
    IF target_current_role = 'SUPER_ADMIN' AND new_role <> 'SUPER_ADMIN' THEN
        IF (SELECT count(*) FROM public.profiles WHERE role = 'SUPER_ADMIN' AND is_active = true) <= 1 THEN
            RAISE EXCEPTION 'Operation Denied: Cannot demote the last remaining active Super Administrator.';
        END IF;
    END IF;

    -- Update role
    UPDATE public.profiles
    SET role = new_role,
        updated_at = now()
    WHERE id = target_user_id;

    -- Log to audit trail
    INSERT INTO public.audit_logs (user_id, action, entity, entity_id, details)
    VALUES (
        caller_id,
        'ROLE_CHANGE',
        'profiles',
        target_user_id::text,
        jsonb_build_object(
            'target_email', target_email,
            'old_role', target_current_role,
            'new_role', new_role,
            'actor_role', caller_role
        )
    );

    RETURN jsonb_build_object('success', true, 'message', 'Role updated successfully', 'user_id', target_user_id, 'new_role', new_role);
END;
$$;

-- Status Update RPC (Activate, Deactivate, Suspend)
CREATE OR REPLACE FUNCTION public.admin_update_user_status(
    target_user_id UUID,
    new_status TEXT,
    reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    caller_id UUID := auth.uid();
    caller_role TEXT;
    target_current_role TEXT;
    target_current_status TEXT;
    target_email TEXT;
    is_active_flag BOOLEAN;
BEGIN
    -- Verify caller
    IF caller_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    SELECT role INTO caller_role FROM public.profiles WHERE id = caller_id AND is_active = true;
    IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
        RAISE EXCEPTION 'Forbidden: Administrator privileges required to change account status.';
    END IF;

    IF new_status NOT IN ('ACTIVE', 'INACTIVE', 'SUSPENDED') THEN
        RAISE EXCEPTION 'Invalid status provided. Must be ACTIVE, INACTIVE, or SUSPENDED.';
    END IF;

    SELECT role, status, email INTO target_current_role, target_current_status, target_email
    FROM public.profiles WHERE id = target_user_id;

    IF target_current_status IS NULL THEN
        RAISE EXCEPTION 'Target user profile not found.';
    END IF;

    -- Super Admin protection
    IF target_current_role = 'SUPER_ADMIN' AND caller_role <> 'SUPER_ADMIN' THEN
        RAISE EXCEPTION 'Forbidden: Only a Super Administrator can alter Super Admin account status.';
    END IF;

    IF target_current_role = 'SUPER_ADMIN' AND new_status <> 'ACTIVE' THEN
        IF (SELECT count(*) FROM public.profiles WHERE role = 'SUPER_ADMIN' AND is_active = true) <= 1 THEN
            RAISE EXCEPTION 'Operation Denied: Cannot deactivate or suspend the last active Super Administrator.';
        END IF;
    END IF;

    is_active_flag := (new_status = 'ACTIVE');

    UPDATE public.profiles
    SET status = new_status,
        is_active = is_active_flag,
        suspension_reason = CASE WHEN new_status = 'SUSPENDED' THEN reason ELSE NULL END,
        updated_at = now()
    WHERE id = target_user_id;

    INSERT INTO public.audit_logs (user_id, action, entity, entity_id, details)
    VALUES (
        caller_id,
        'STATUS_CHANGE',
        'profiles',
        target_user_id::text,
        jsonb_build_object(
            'target_email', target_email,
            'old_status', target_current_status,
            'new_status', new_status,
            'reason', reason,
            'actor_role', caller_role
        )
    );

    RETURN jsonb_build_object('success', true, 'message', 'Status updated successfully', 'user_id', target_user_id, 'new_status', new_status);
END;
$$;

-- Login Event Logger RPC
CREATE OR REPLACE FUNCTION public.record_login_event(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    UPDATE public.profiles
    SET last_login_at = now()
    WHERE id = target_user_id;

    INSERT INTO public.audit_logs (user_id, action, entity, entity_id, details)
    VALUES (
        target_user_id,
        'LOGIN',
        'auth.users',
        target_user_id::text,
        jsonb_build_object('timestamp', now())
    );
END;
$$;

-- 5. Enable RLS on Roles and Permissions
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone authenticated can view roles" ON public.roles;
CREATE POLICY "Anyone authenticated can view roles"
    ON public.roles FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Anyone authenticated can view permissions" ON public.permissions;
CREATE POLICY "Anyone authenticated can view permissions"
    ON public.permissions FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Anyone authenticated can view role permissions" ON public.role_permissions;
CREATE POLICY "Anyone authenticated can view role permissions"
    ON public.role_permissions FOR SELECT TO authenticated
    USING (true);

-- 6. Avatar Storage Bucket Setup (if storage extension is available)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS for Avatars Bucket
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload own avatar"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'avatars' 
        AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid()::text = replace(name, '.' || storage.extension(name), ''))
    );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
