"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    // Assuming useAuth is a custom hook that might be used later or is intended to be part of the change.
    // If useAuth is not defined, this line will cause an error.
    // const { login } = useAuth(); 

    useEffect(() => {
        // Use a small delay to ensure the component is effectively mounted
        // and to avoid conflicts during fast navigation/Strict Mode re-renders.
        let toastId: string | number;

        const timer = setTimeout(() => {
            // Helper for Recruiters/Testers
            toastId = toast.custom((t) => (
                <div className="relative overflow-hidden rounded-[20px] w-[380px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] animate-in slide-in-from-bottom-5 duration-700 font-sans group">
                    {/* Advanced iOS Glassmorphism - Lighter & Glossier */}
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-3xl saturate-200 z-0" />

                    {/* Gradient Gloss Reflection (Top) */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-0 opacity-50" />

                    {/* Subtle White Border */}
                    <div className="absolute inset-0 rounded-[20px] border border-white/50 dark:border-white/10 z-10 pointer-events-none" />

                    <div className="relative z-20 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.6)] animate-pulse" />
                                <h3 className="font-semibold text-[13px] text-zinc-800 dark:text-zinc-100 tracking-wider uppercase opacity-90">Recruiter Access</h3>
                            </div>
                            <button
                                onClick={() => toast.dismiss(toastId)}
                                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-zinc-700 dark:text-zinc-300 text-[14px] leading-relaxed mb-5 font-medium">
                            Welcome! Use these demo credentials to evaluate the admin dashboard:
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 shadow-sm transition-all hover:bg-white/90 dark:hover:bg-white/15">
                                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Username</span>
                                <code className="text-[13px] font-bold text-zinc-900 dark:text-[#0A84FF] font-mono tracking-wide selection:bg-blue-200">admin</code>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 shadow-sm transition-all hover:bg-white/90 dark:hover:bg-white/15">
                                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Password</span>
                                <code className="text-[13px] font-bold text-zinc-900 dark:text-[#0A84FF] font-mono tracking-wide selection:bg-blue-200">admin123</code>
                            </div>
                        </div>
                    </div>
                </div>
            ), {
                duration: Infinity,
                // Removed fixed ID to allow unique instance per mount if needed, 
                // but handled duplicate prevention via previous cleanup.
            });
        }, 100);

        // Cleanup: Dismiss ONLY this specific toast instance when component unmounts
        return () => {
            clearTimeout(timer);
            if (toastId) toast.dismiss(toastId);
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === "admin" && password === "admin123") {
            // In a real app, use a Server Action to set HttpOnly cookie.
            // For this demo, we set a cookie that Middleware can read.
            document.cookie = "auth=true; path=/; max-age=86400; SameSite=Strict";
            router.push("/dashboard");
        } else {
            setError("Invalid credentials");
            setIsLoading(false);
            // Shake animation trigger could be here
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/20 to-emerald-900/20 animate-gradient-xy" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[400px] shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-800">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                        <CardDescription>Enter your credentials to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="username"
                                        placeholder="Enter username"
                                        className="pl-9"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </motion.div>
                            )}

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
