import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {/* Search Bar Skeleton */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-72" />
            </div>

            {/* List Items Skeletons */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 p-6 border rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                    <div className="space-y-3 flex-1">
                        <Skeleton className="h-6 w-48" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="md:w-1/3 space-y-3 pl-6 border-l border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-16 w-full" />
                        <div className="flex justify-between pt-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
