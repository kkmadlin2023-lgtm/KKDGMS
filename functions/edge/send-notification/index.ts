import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY") ?? "";

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { title, body, targetRole, specificUserId, dataPayload } = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: "Title and message body are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Query active tokens
    let query = supabaseAdmin
      .from("device_tokens")
      .select("fcm_token, user_id")
      .eq("is_active", true);

    if (specificUserId) {
      query = query.eq("user_id", specificUserId);
    }

    const { data: tokenRecords, error: tokenError } = await query;
    if (tokenError) throw tokenError;

    const tokens = (tokenRecords || []).map((t: any) => t.fcm_token);

    if (tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No active devices to notify" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Dispatch via FCM Legacy or v1
    const fcmPayload = {
      registration_ids: tokens,
      notification: {
        title,
        body,
        icon: "/assets/images/logo.png",
        click_action: "/",
      },
      data: dataPayload || {},
    };

    let fcmResponseStatus = 200;
    if (fcmServerKey) {
      const res = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Authorization": `key=${fcmServerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fcmPayload),
      });
      fcmResponseStatus = res.status;
    }

    // Save notification record to Supabase
    await supabaseAdmin.from("notifications").insert({
      title,
      message: body,
      target_role: targetRole || null,
      target_user_id: specificUserId || null,
      priority: "HIGH",
      status: "ACTIVE",
    });

    return new Response(JSON.stringify({ 
      success: true, 
      recipientCount: tokens.length,
      fcmStatus: fcmResponseStatus 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Push dispatch failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
