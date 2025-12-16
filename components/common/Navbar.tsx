"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                        LeadFlow
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-blue-600",
                            pathname === "/dashboard"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-300"
                        )}
                    >
                        Dashboard
                    </Link>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => {
                            // Initial simple logout
                            document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                            window.location.href = "/login";
                        }}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
