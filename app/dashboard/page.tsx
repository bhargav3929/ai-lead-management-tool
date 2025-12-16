"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, RefreshCcw, Flame, Snowflake, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/dashboard/StatsCard";
import LeadCard from "@/components/dashboard/LeadCard";
import ContactModal from "@/components/dashboard/ContactModal";
import { Lead } from "@/types/lead";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch leads
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads(data);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();

        // Realtime Subscription
        const channel = supabase
            .channel('leads-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setLeads((prev) => [payload.new as Lead, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setLeads((prev) =>
                        prev.map((lead) => (lead.id === payload.new.id ? { ...lead, ...payload.new } : lead))
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Derived state
    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.business_type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filter === "All" ||
            lead.lead_quality_score === filter;

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: leads.length,
        hot: leads.filter(l => l.lead_quality_score === 'Hot').length,
        warm: leads.filter(l => l.lead_quality_score === 'Warm').length,
        cold: leads.filter(l => l.lead_quality_score === 'Cold').length,
    };

    const handleContact = (lead: Lead) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Overview</h1>
                        <p className="text-slate-500">Manage and track your incoming leads.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchLeads} className="gap-2">
                        <RefreshCcw className="h-4 w-4" /> Refresh
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Leads"
                        value={stats.total}
                        icon={Filter}
                        className="border-l-4 border-l-slate-500"
                    />
                    <StatsCard
                        title="Hot Leads"
                        value={stats.hot}
                        icon={Flame}
                        className="border-l-4 border-l-orange-500"
                        description="High priority"
                    />
                    <StatsCard
                        title="Warm Leads"
                        value={stats.warm}
                        icon={Sun}
                        className="border-l-4 border-l-yellow-400"
                        description="Nurture needed"
                    />
                    <StatsCard
                        title="Cold Leads"
                        value={stats.cold}
                        icon={Snowflake}
                        className="border-l-4 border-l-blue-400"
                        description="Long term"
                    />
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
                <Tabs defaultValue="All" value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Hot" className="data-[state=active]:text-orange-600">Hot</TabsTrigger>
                        <TabsTrigger value="Warm" className="data-[state=active]:text-yellow-600">Warm</TabsTrigger>
                        <TabsTrigger value="Cold" className="data-[state=active]:text-blue-600">Cold</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Leads List */}
            <div className="space-y-4 min-h-[400px]">
                {loading ? (
                    <LoadingSkeleton />
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed">
                        <p className="text-slate-500">No leads found matching your criteria.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredLeads.map((lead) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                layout
                            >
                                <LeadCard lead={lead} onContact={handleContact} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lead={selectedLead}
            />
        </div>
    );
}
