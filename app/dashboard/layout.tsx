import Navbar from "@/components/common/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-24">
                {children}
            </main>
        </div>
    );
}
