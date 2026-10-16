import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T = any> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links?: PaginationLink[];
}

interface PaginationProps {
    links?: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
    currentPage?: number;
    lastPage?: number;
    prevUrl?: string | null;
    nextUrl?: string | null;
    className?: string;
}

export default function Pagination({
    links = [],
    from = null,
    to = null,
    total = 0,
    currentPage = 1,
    lastPage = 1,
    prevUrl = null,
    nextUrl = null,
    className = '',
}: PaginationProps) {
    if (!links || links.length <= 1) {
        return null;
    }

    // Clean up label (e.g. &laquo; Previous -> Prev, Next &raquo; -> Next)
    const formatLabel = (label: string) => {
        if (label.includes('Previous') || label.includes('&laquo;')) return 'Sebelumnya';
        if (label.includes('Next') || label.includes('&raquo;')) return 'Berikutnya';
        return label;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 ${className}`}>
            <div>
                Menampilkan <span className="font-semibold text-gray-800 dark:text-gray-200">{from || 0}</span> sampai{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{to || 0}</span> dari{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span> data
            </div>

            <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                {links.map((link, idx) => {
                    const isPrev = idx === 0;
                    const isNext = idx === links.length - 1;
                    const label = formatLabel(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={idx}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed select-none ${
                                    isPrev || isNext ? 'flex items-center gap-1' : ''
                                }`}
                            >
                                {isPrev && <ChevronLeft className="size-3.5" />}
                                {label}
                                {isNext && <ChevronRight className="size-3.5" />}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                link.active
                                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            } ${isPrev || isNext ? 'flex items-center gap-1' : ''}`}
                        >
                            {isPrev && <ChevronLeft className="size-3.5" />}
                            {label}
                            {isNext && <ChevronRight className="size-3.5" />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
