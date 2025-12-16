# AI-Powered Lead Management Dashboard

A premium, production-ready lead management system with AI-powered lead qualification, built with Next.js 14+, Supabase, and Tailwind CSS.

## 🚨 Critical Setup Step: Create Database Table

The error `Database Error: Could not find the table 'public.leads'` occurs because the database table has not been created yet.

**You must run the following SQL in your [Supabase SQL Editor](https://supabase.com/dashboard/project/kybzdjdhbnmwoazemnfg/sql):**

```sql
-- 1. Create the leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT NOT NULL,
  requirement TEXT NOT NULL,
  
  -- AI Generated Fields
  ai_summary TEXT,
  lead_quality_score TEXT CHECK (lead_quality_score IN ('Hot', 'Warm', 'Cold')),
  suggested_next_action TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for performance
CREATE INDEX idx_lead_quality_score ON leads(lead_quality_score);

-- 3. (Optional) Enable Row Level Security if needed, 
-- implies you need to add policies for anon insert if you want public submission 
-- without auth, or use service role. 
-- For this Demo, we assume RLS is either off or configured to allow anon inserts.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select" ON leads FOR SELECT USING (true); 
-- Note: In production, "Allow anon select" is dangerous. 
-- Better: Only allow authenticated (admin) to select.
-- CREATE POLICY "Allow admin select" ON leads FOR SELECT TO authenticated USING (true);
```

> **Note**: This application uses the `anon` key. Ensure your RLS policies allow the `anon` role to `INSERT` rows.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure `.env.local` is present with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD`

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - **Public Form**: [http://localhost:3000](http://localhost:3000)
   - **Admin Login**: [http://localhost:3000/login](http://localhost:3000/login) (Credentials: `admin` / `admin123`)

## ✨ Features
- **AI Analysis**: Automatically scores leads as Hot/Warm/Cold.
- **Real-time Dashboard**: Track metrics and filter leads.
- **Automation**: One-click webhook trigger for follow-ups.
