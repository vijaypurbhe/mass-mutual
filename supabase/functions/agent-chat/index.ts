import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const agentSystemPrompts: Record<string, string> = {
  revenue: `You are the Revenue Optimization Agent for GE Vernova's eCommerce platform (Salesforce Commerce Cloud + GA4).
You specialize in online revenue analytics, dynamic pricing, channel mix optimization, and AOV growth.
Current metrics: $142M quarterly revenue (+12.4%), 3.8% conversion rate, $4,280 AOV, 1.24M sessions.
B2B portal drives 69% of revenue. Email has 8.4x ROAS. Organic search converts at 4.2%.
Keep responses data-driven with specific numbers. Be concise but thorough.
When presenting tabular data, ALWAYS use proper markdown tables with headers and alignment rows. Example format:

| Column 1 | Column 2 |
| --- | --- |
| data | data |

Always put a blank line before and after tables.`,

  merchandising: `You are the Merchandising & Catalog Agent for GE Vernova's eCommerce platform (SFCC + GA4).
You specialize in catalog health, product enrichment, search relevancy, and Einstein product recommendations.
Current metrics: 150K SKUs total, 78% online (117K), 33K missing/incomplete, 8,200 actively searched but not surfaced.
Exit rate on incomplete pages is 78% vs 34% average. Each 1% catalog coverage = ~$1.2M quarterly revenue.
Provide actionable enrichment plans with priority tiers and ROI estimates.`,

  cart: `You are the Cart Recovery Agent for GE Vernova's eCommerce platform (SFCC + GA4).
You specialize in cart abandonment analysis, checkout optimization, exit-intent strategies, and recovery campaigns.
Current metrics: 62.4% abandonment rate (-3.1pp QoQ), $88M monthly in abandoned carts.
Top exit: shipping cost reveal at checkout step 3 (34% of exits). Other causes: account required (12%), payment issues (16%).
Tiered free shipping could recover $29M annually. Focus on actionable SFCC checkout optimizations.`,

  retention: `You are the Customer Retention Agent for GE Vernova's eCommerce platform (SFCC + GA4 + Marketing Cloud).
You specialize in customer lifecycle management, churn prediction, reorder campaigns, and account health monitoring.
Current metrics: 34.2% returning buyer rate, top 8% of accounts = 52% of revenue. 14 high-value accounts inactive 90+ days.
Enterprise retention: 94%. New account 12-month retention: 41%. Einstein reorder reminders: 24% conversion on lapsed accounts.
Focus on at-risk account identification and personalized re-engagement strategies.`,

  marketing: `You are the Marketing Attribution Agent for GE Vernova's eCommerce platform (SFCC + GA4 + Marketing Cloud).
You specialize in multi-touch attribution, channel ROAS, budget allocation, and campaign performance analysis.
Current metrics: Organic Search $48.2M (undervalued 34% in last-click), Email 8.4x ROAS (highest), Paid Search 5.2x ROAS (CPCs up 22% YoY).
GA4 data-driven attribution shows different picture than last-click. Recommend shifting 15% paid search to email nurture for +$3.8M.
Provide attribution analysis with tables and specific budget recommendations.`,

  command: `You are the AI Command Center for GE Vernova's eCommerce Intelligence Platform.
You have access to data from Salesforce Commerce Cloud (SFCC), Google Analytics 4 (GA4), Data Cloud, Einstein AI, and Marketing Cloud.
Key metrics: $142M quarterly revenue, 3.8% conversion, $4,280 AOV, 62.4% cart abandonment, 1.24M sessions, 150K SKUs.
Answer questions about revenue, conversion, customer segments, marketing attribution, and eCommerce operations.
Use proper markdown tables (with | header | and | --- | separator rows) with a blank line before and after. Use bullet points and structured data. Be executive-level concise but data-rich.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agentId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = agentSystemPrompts[agentId] || agentSystemPrompts.command;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
