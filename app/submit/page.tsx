import LeadForm from "@/components/forms/LeadForm";

export default function SubmitPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center justify-center min-h-screen gap-10">

                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Transform Your <br />
                        <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                            Business Inquiry
                        </span>
                        {" "}into Action
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Experience AI-powered lead management that understands your needs before we even talk.
                    </p>
                </div>

                <div className="w-full max-w-lg">
                    <LeadForm />
                </div>

            </div>
        </main>
    );
}
