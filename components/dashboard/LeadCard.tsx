import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { Calendar, Mail, Phone, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Need to install date-fns or use native Intl

interface LeadCardProps {
    lead: Lead;
    onContact: (lead: Lead) => void;
}

// Helper for Relative Time (simple version to avoid dependency if possible, but package.json didn't show date-fns. I'll add a simple helper fn or install date-fns later if needed. I'll use a simple helper for now.)
function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export default function LeadCard({ lead, onContact }: LeadCardProps) {

    const getScoreColor = (score?: string) => {
        switch (score) {
            case 'Hot': return "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200";
            case 'Warm': return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
            case 'Cold': return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">

                    {/* Left Column: Basic Info */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between md:justify-start gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{lead.name}</h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant="outline" className={getScoreColor(lead.lead_quality_score)}>
                                        {lead.lead_quality_score || 'Pending Analysis'}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        {lead.business_type}
                                    </Badge>
                                    {lead.budget && (
                                        <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-100">
                                            {lead.budget}
                                        </Badge>
                                    )}
                                    {lead.timeline && (
                                        <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-100">
                                            {lead.timeline}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" /> {lead.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" /> {lead.phone}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                            <p className="text-sm italic text-slate-600 dark:text-slate-400">"{lead.requirement}"</p>
                        </div>
                    </div>

                    {/* Right Column: AI Insights & Actions */}
                    <div className="md:w-1/3 flex flex-col justify-between border-l pl-0 md:pl-6 border-slate-100 dark:border-slate-800 gap-4">
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">AI Analysis</h4>
                            {lead.ai_summary ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{lead.ai_summary}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Suggested:</span>
                                        <Badge className="bg-slate-900 text-white hover:bg-slate-800">{lead.suggested_next_action || 'Review'}</Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Analysis in progress...</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                            </span>
                            <Button size="sm" onClick={() => onContact(lead)} className="bg-blue-600 hover:bg-blue-700">
                                Contact <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
