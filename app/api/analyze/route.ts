import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to structure the prompt
function createPrompt(lead: any) {
    return `Analyze this business lead and provide ONLY a JSON response with no additional text.

Lead Details:
- Name: ${lead.name}
- Email: ${lead.email}
- Phone: ${lead.phone}
- Business Type: ${lead.business_type}
- Budget: ${lead.budget || "Not specified"}
- Timeline: ${lead.timeline || "Not specified"}
- Requirement: ${lead.requirement}

Return ONLY valid JSON in this exact format:
{
  "summary": "One sentence describing the lead's core need, budget, and timeline.",
  "leadQualityScore": "Hot" | "Warm" | "Cold",
  "suggestedNextAction": "Call" | "Email" | "Follow-up" | "Schedule Demo"
}

Scoring criteria:
- Hot: High budget (5L+), urgent timeline (Immediate/1-3 Months), clear requirements.
- Warm: Medium budget (50k-5L), medium timeline (3-6 Months), exploring but serious.
- Cold: Low budget (<50k), distant timeline (Exploratory), vague requirements.`;
}

export async function POST(req: Request) {
    try {
        const { leadId } = await req.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
        }

        // 1. Fetch Lead
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // 2. Call OpenRouter
        const prompt = createPrompt(lead);

        // Retry logic could be implemented here, but for simplicity/MVP one shot + simple retry handled by client or simple loop.
        // Making call:
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                // 'HTTP-Referer': 'https://your-site.com', // Optional
                // 'X-Title': 'Lead Dashboard' // Optional
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' } // Force JSON response if supported, or rely on prompt
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API Error:', errorText);
            throw new Error(`AI API failed: ${response.status}`);
        }

        const aiData = await response.json();
        const content = aiData.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content from AI');
        }

        // 3. Parse JSON
        let parsedResult;
        try {
            parsedResult = JSON.parse(content);
        } catch (e) {
            // Fallback or retry?
            console.error('JSON Parse Error', content);
            // Simple cleanup if code blocks are present
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResult = JSON.parse(cleanContent);
        }

        // 4. Update Lead in DB
        const updates = {
            ai_summary: parsedResult.summary,
            lead_quality_score: parsedResult.leadQualityScore,
            suggested_next_action: parsedResult.suggestedNextAction
        };

        const { error: updateError } = await supabase
            .from('leads')
            .update(updates)
            .eq('id', leadId);

        if (updateError) {
            console.error('Update Lead Error:', JSON.stringify(updateError, null, 2));
            throw new Error(`Failed to update lead: ${updateError.message} (Code: ${updateError.code})`);
        }

        return NextResponse.json({ success: true, analysis: updates });

    } catch (err: any) {
        console.error('Analyze Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
