export type LeadQuality = 'Hot' | 'Warm' | 'Cold';

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    business_type: string;
    requirement: string;
    budget?: string;
    timeline?: string;
    ai_summary?: string;
    lead_quality_score?: LeadQuality;
    suggested_next_action?: string;
    created_at: string;
    updated_at?: string;
}

export interface NewLeadInput {
    name: string;
    email: string;
    phone: string;
    business_type: string;
    budget: string;
    timeline: string;
    requirement: string;
}
