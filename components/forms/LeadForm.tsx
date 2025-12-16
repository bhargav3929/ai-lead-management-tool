"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Loader2, Send, CheckCircle2, User, Mail, Phone, Building2, FileText, Banknote, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { NewLeadInput } from "@/types/lead";
import { toast } from "sonner";
import Link from "next/link";

export default function LeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<NewLeadInput>();

    const onSubmit = async (data: NewLeadInput) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to submit');
            }

            const lead = await res.json();

            // Attempt AI Analysis immediately
            try {
                const analyzeRes = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ leadId: lead.id }),
                });

                if (!analyzeRes.ok) {
                    const errorText = await analyzeRes.text();
                    throw new Error(errorText || analyzeRes.statusText);
                }
            } catch (err: any) {
                console.error("AI Analysis weak fail", err);
                toast.error(`Lead saved, but AI Analysis failed: ${err.message || "Unknown error"}`);
            }

            setIsSuccess(true);
            toast.success("Lead submitted successfully!");

            setIsSuccess(true);
            toast.success("Lead submitted successfully!");

            // Should reset form but keep modal open
            reset();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            <Card className="w-full max-w-lg mx-auto backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 shadow-2xl border-slate-200/50 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                        Get Started
                    </CardTitle>
                    <CardDescription className="text-center text-slate-500">
                        Tell us about your project
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <motion.form
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="pl-9 focus-visible:ring-blue-500"
                                    {...register("name", { required: true })}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-9 focus-visible:ring-blue-500"
                                    {...register("email", { required: true })}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-9 focus-visible:ring-blue-500"
                                    {...register("phone", { required: true })}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="business_type">Business Type</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                <Select onValueChange={(val) => setValue("business_type", val)} required>
                                    <SelectTrigger className="pl-9 focus:ring-blue-500">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                                        <SelectItem value="SaaS">SaaS</SelectItem>
                                        <SelectItem value="Consulting">Consulting</SelectItem>
                                        <SelectItem value="Agency">Agency</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget</Label>
                                <div className="relative">
                                    <Banknote className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                    <Select onValueChange={(val) => setValue("budget", val)} required>
                                        <SelectTrigger className="pl-9 focus:ring-blue-500">
                                            <SelectValue placeholder="Budget Range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="< 50k">{'<'} ₹50,000</SelectItem>
                                            <SelectItem value="50k-1L">₹50,000 - ₹1 Lakh</SelectItem>
                                            <SelectItem value="1L-5L">₹1 Lakh - ₹5 Lakhs</SelectItem>
                                            <SelectItem value="5L+">₹5 Lakhs+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeline">Timeline</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                    <Select onValueChange={(val) => setValue("timeline", val)} required>
                                        <SelectTrigger className="pl-9 focus:ring-blue-500">
                                            <SelectValue placeholder="Timeline" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Urgent">Immediate (Urgent)</SelectItem>
                                            <SelectItem value="1-3 Months">1-3 Months</SelectItem>
                                            <SelectItem value="3-6 Months">3-6 Months</SelectItem>
                                            <SelectItem value="Exploratory">Just Exploring</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="requirement">Requirements</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Textarea
                                    id="requirement"
                                    placeholder="Tell us about your project..."
                                    className="pl-9 min-h-[100px] focus-visible:ring-blue-500"
                                    {...register("requirement", { required: true })}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform active:scale-[0.98]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Details...
                                    </>
                                ) : (
                                    <>
                                        Submit Lead <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.form>
                </CardContent>
            </Card>

            <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center">Details Shared Successfully!</DialogTitle>
                        <DialogDescription asChild>
                            <div className="text-center space-y-2">
                                <p>Thank you for submitting your details. Our team has been notified.</p>
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mt-4 border border-slate-100 dark:border-slate-800">
                                    <p className="font-medium text-slate-900 dark:text-white mb-2">Technical Assessment Context:</p>
                                    <p className="text-sm">
                                        The lead has been captured and analyzed by the AI. <br />
                                        Would you like to visit the Admin Dashboard to see the AI classification and summary?
                                    </p>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full sm:w-auto">
                            Close
                        </Button>
                        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href="/login">
                                Check Admin Dashboard
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
