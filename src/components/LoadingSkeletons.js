/**
 * Loading Skeleton Components
 * Reusable skeletons for better UX during data loading
 */

export function CardSkeleton() {
    return (
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden animate-pulse">
            <div className="h-48 bg-slate-800"></div>
            <div className="p-4 sm:p-6">
                <div className="h-6 bg-slate-800 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded mb-2 w-full"></div>
                <div className="h-4 bg-slate-800 rounded mb-6 w-2/3"></div>
                <div className="h-2 bg-slate-800 rounded-full mb-4"></div>
                <div className="h-10 bg-slate-800 rounded-xl"></div>
            </div>
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex items-center gap-3 sm:gap-4 animate-pulse">
            <div className="p-2 sm:p-3 bg-slate-800 rounded-xl w-12 h-12"></div>
            <div className="flex-1">
                <div className="h-3 bg-slate-800 rounded mb-2 w-20"></div>
                <div className="h-6 bg-slate-800 rounded w-12"></div>
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 3 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 animate-pulse">
                    <div className="h-5 bg-slate-800 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 py-12 text-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                {/* Welcome Section Skeleton */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-8 mb-8 animate-pulse">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800"></div>
                        <div className="flex-1">
                            <div className="h-8 bg-slate-800 rounded mb-2 w-64"></div>
                            <div className="h-4 bg-slate-800 rounded w-48"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <StatSkeleton />
                    <StatSkeleton />
                    <StatSkeleton />
                    <StatSkeleton />
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-800">
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={i} className="p-3">
                                <div className="h-4 bg-slate-800 rounded w-20 animate-pulse"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-slate-800">
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <td key={colIndex} className="p-3">
                                    <div className="h-4 bg-slate-800 rounded animate-pulse"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
