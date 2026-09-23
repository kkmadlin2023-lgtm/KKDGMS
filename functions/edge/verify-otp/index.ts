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
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { examId, enteredOtp, studentId } = await req.json();

    if (!examId || !enteredOtp || !studentId) {
      return new Response(JSON.stringify({ error: "Exam ID, student ID, and OTP are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Retrieve exam record
    const { data: exam, error: examError } = await supabaseAdmin
      .from("online_exams")
      .select("start_otp, otp_generated_at, otp_valid_seconds, is_published, is_active")
      .eq("id", examId)
      .single();

    if (examError || !exam) {
      return new Response(JSON.stringify({ error: "Exam not found or inactive" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!exam.is_active || !exam.is_published) {
      return new Response(JSON.stringify({ error: "Exam is not currently active" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check OTP match
    if (exam.start_otp !== enteredOtp) {
      return new Response(JSON.stringify({ error: "Invalid OTP code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check OTP expiry (default 10 seconds validity window)
    if (exam.otp_generated_at) {
      const generatedAt = new Date(exam.otp_generated_at).getTime();
      const now = Date.now();
      const validDurationMs = (exam.otp_valid_seconds || 10) * 1000;

      // Allow 15s grace period for network latency
      if (now - generatedAt > validDurationMs + 15000) {
        return new Response(JSON.stringify({ error: "OTP has expired. Please ask your invigilator to generate a new OTP." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Initialize or retrieve existing exam attempt for student
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("exam_attempts")
      .upsert({
        exam_id: examId,
        student_id: studentId,
        status: "IN_PROGRESS",
        started_at: new Date().toISOString(),
      }, { onConflict: "exam_id,student_id" })
      .select()
      .single();

    if (attemptError) throw attemptError;

    return new Response(JSON.stringify({
      success: true,
      message: "OTP verified. Exam session active.",
      attemptId: attempt.id,
      startedAt: attempt.started_at,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "OTP verification failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
