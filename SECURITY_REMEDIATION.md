# Security remediation plan

## Current findings

The legacy app must not be treated as production-ready:

- The UI initializes an administrator-like session in the browser and persists session data in `sessionStorage`.
- Existing database policies use broad `USING (true)` / `WITH CHECK (true)` rules for sensitive tables.
- The legacy schema includes sample student data, identity numbers, phone numbers, and predictable public tokens.
- Authentication and role authorization are not anchored to `auth.users`.

## Included foundation

`supabase/migrations/20260911000000_phase_1_auth_foundation.sql` adds profiles tied to Supabase Auth, a fixed role set, page permissions, private audit logs, supporting functions, indexes, and restrictive RLS policies for the new foundation tables. It deliberately does not delete or alter existing records.

## Required before production

1. Rotate every credential or privileged key ever shared outside a secure secret store.
2. Remove all seed PII and test tokens from deployed databases and public history.
3. Provision Supabase Auth identities, then map legacy records into `profiles`.
4. Replace broad legacy RLS policies table by table with policies based on `auth.uid()` and `current_role()`.
5. Replace the mock browser session with Supabase Auth session handling and server-side enforcement.
6. Move privileged operations, notifications, OTPs, and approval links into Edge Functions.
7. Run the migration only in a reviewed staging environment first; validate access for every role.

The migration is an additive foundation, not evidence that the legacy tables are now secure.
