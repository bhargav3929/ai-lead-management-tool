import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Use environment variable or fallback from the user's codebase
        const webhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.srv1136844.hstgr.cloud/webhook/56e36b12-ea11-4dfb-8846-2aebf800b648";

        if (!webhookUrl) {
            return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
        }

        // Convert body to query params since n8n is expecting GET
        const url = new URL(webhookUrl);
        Object.keys(body).forEach(key => url.searchParams.append(key, body[key]));

        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Webhook failed: ${res.statusText} - ${errorText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Contact Proxy Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
