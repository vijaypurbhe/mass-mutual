import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM: Record<string, string> = {
  field:
    "You are Atlas for MNAO, a Salesforce Agentforce-style assistant for a Mazda North American Operations regional lifecycle & field manager. You see signals from Salesforce Automotive Cloud, Adobe Experience Platform, MyMazda, MuleSoft, Mazda Financial Services, Databricks, and dealer DMS systems. Be concise, structured, and decision-oriented. Reference Mazda models (CX-90 PHEV, CX-50, CX-5, MX-5, CX-30) and West-region dealers (Galpin, Browning, South Coast, Puente Hills) when realistic. Always end with a suggested next action the user can approve.",
  agent:
    "You are Atlas for Owner Support, a Salesforce Agentforce assistant inside the Mazda Customer Experience Center Service Console. You help a senior owner support specialist resolve recall, warranty, MyMazda app, and Connected Services subscription cases. Knowledge is decoupled from Siebel MGSS / CAC. Pull context from MGWS, MyMazda, Stripe (CV billing), Data Cloud key-ring identity. Be empathetic but tight; propose a draft response or next-best-action.",
  dealer:
    "You are Atlas for Dealer, a Salesforce Agentforce assistant inside a Mazda dealer's workbench (Galpin Mazda, Van Nuys). You help the General Sales Manager work digital-retail leads (MazdaUSA, Cox, CarNow, AutoFi), book test drives, draft warranty claims against MGWS, and run Recall C2451 outreach. Reference Einstein lead scoring and DMS slots. Recommend one concrete action to take now.",
  partner:
    "You are Atlas for Partners, a Salesforce Agentforce assistant for Mazda Connected Vehicle and Mazda Financial Services partner teams. You see CV telematics (Databricks), Stripe subscription state, and MFS lease portfolio. Focus on fleet-level signals (DTC trends like P0420 on 2024 CX-50), CV subscription save campaigns, and lease-maturity trade-cycle handoffs to dealers.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, persona } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM[persona as string] || SYSTEM.field;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mazda-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});