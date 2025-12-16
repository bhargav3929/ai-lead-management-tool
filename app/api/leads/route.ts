import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { NewLeadInput } from '@/types/lead';

export async function POST(req: Request) {
    try {
        const body: NewLeadInput = await req.json();

        const { data, error } = await supabase
            .from('leads')
            .insert([body])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error Detailed:', JSON.stringify(error, null, 2));
            return NextResponse.json({ error: `Database Error: ${error.message} (Code: ${error.code})` }, { status: 500 });
        }

        // Trigger AI analysis asynchronously (optional, or call it here)
        // For this architecture, let's assume the frontend calls analyze separately 
        // OR we trigger it here. PRD suggests "When a lead is submitted, call OpenRouter API".
        // Better pattern: Client submits lead -> Success -> Client calls Analyze API with Lead ID?
        // OR Server does it all. 
        // PRD "Error Handling: If AI call fails: Store lead with null AI fields" implies we should store lead first.
        // Let's keep it simple: Create lead, return it, let client call analyze or invoke analyze here.
        // To ensure "Fast" response, client side orchestration is often better for perception,
        // but server side is more robust.
        // I'll stick to just creating lead here.

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(leads);
    } catch (err) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
