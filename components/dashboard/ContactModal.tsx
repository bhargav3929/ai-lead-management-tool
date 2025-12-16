"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle2, Zap } from "lucide-react";
import { Lead } from "@/types/lead";
import { toast } from "sonner";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
}

export default function ContactModal({ isOpen, onClose, lead }: ContactModalProps) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    if (!lead) return null;

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        try {
            // Prepare payload
            const payload = {
                leadId: lead.id,
                leadName: lead.name,
                leadEmail: lead.email,
                message: message,
                timestamp: new Date().toISOString()
            };

            // Trigger n8n webhook via our Proxy API (prevents CORS)
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            // If n8n doesn't return CORS headers, this will throw/fail in browser even if successful on server.
            // But let's assume it works or use no-cors.

            setIsSent(true);
            toast.success("Message sent successfully!");

            setTimeout(() => {
                setIsSent(false);
                setMessage("");
                onClose();
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error("Failed to trigger automation.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Contact {lead.name}</DialogTitle>
                    <DialogDescription>
                        Send a message to <b>{lead.email}</b>
                    </DialogDescription>
                </DialogHeader>

                {isSent ? (
                    <div className="flex flex-col items-center justify-center py-8 text-green-600">
                        <CheckCircle2 className="h-12 w-12 mb-2" />
                        <p className="font-medium">Sent Successfully via n8n!</p>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {/* Automation Context Box */}
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                                Automation Workflow
                            </h4>
                            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                <p>
                                    This action triggers a background <b>n8n workflow</b>.
                                </p>
                                <div className="flex items-center gap-2 text-[11px] font-mono bg-white dark:bg-black/20 p-2 rounded border border-slate-200 dark:border-slate-800">
                                    <span>Your Message</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="text-blue-500 font-bold">n8n Webhook</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="text-purple-500 font-bold">Gmail API</span>
                                    <span className="text-slate-300">→</span>
                                    <span>{lead.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email Body
                            </label>
                            <Textarea
                                placeholder="Hi, I reviewed your project details..."
                                className="min-h-[120px] resize-none focus-visible:ring-blue-500"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <p className="text-[10px] text-slate-400 text-right">
                                This content will be inserted into the email template.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {!isSent && (
                        <>
                            <Button variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
                            <Button onClick={handleSend} disabled={isSending || !message.trim()} className="bg-blue-600 hover:bg-blue-700">
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
