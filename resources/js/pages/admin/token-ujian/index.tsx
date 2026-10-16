import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Check,
    Clock,
    Copy,
    Info,
    Key,
    RefreshCw,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Token Ujian', href: '/admin/token-ujian' },
];

interface TokenUjianProps {
    token: {
        id_token?: number;
        token: string;
        time: string;
        masa_berlaku?: string;
    } | null;
}

export default function TokenUjianIndex({ token }: TokenUjianProps) {
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCopy = () => {
        if (token?.token) {
            navigator.clipboard.writeText(token.token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        router.post('/admin/token-ujian/generate', {}, {
            onFinish: () => setIsGenerating(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Token Ujian - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-purple-100 mb-2">
                            <Key className="size-3.5 text-amber-300" />
                            Otorisasi Ujian Siswa
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Rilis Token Ujian</h1>
                        <p className="text-purple-100 text-sm mt-1">
                            Generate token acak 6 digit untuk dibagikan kepada peserta sebelum ujian dimulai.
                        </p>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold shadow-md w-fit"
                    >
                        <RefreshCw className={`size-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                        Rilis Token Baru
                    </Button>
                </div>

                {/* Token Display Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm text-center flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2">
                        Token Ujian Aktif Saat Ini
                    </span>

                    <div className="my-6 inline-flex items-center justify-center bg-gradient-to-b from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-950/40 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl px-10 py-6 shadow-inner">
                        <span className="text-5xl md:text-6xl font-mono font-extrabold tracking-widest text-purple-700 dark:text-purple-300 select-all">
                            {token?.token || '------'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="font-medium text-xs px-4 py-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                        >
                            {copied ? (
                                <>
                                    <Check className="size-4 text-emerald-600 mr-2" />
                                    Berhasil Disalin!
                                </>
                            ) : (
                                <>
                                    <Copy className="size-4 text-purple-600 mr-2" />
                                    Salin Token
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-4 py-2"
                        >
                            <Sparkles className="size-4 mr-2" />
                            Generate Ulang
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-6 w-full">
                        <div className="flex items-center gap-1.5">
                            <Clock className="size-4 text-purple-600" />
                            <span>Waktu Rilis: <strong>{token?.time || '-'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldAlert className="size-4 text-amber-500" />
                            <span>Masa Berlaku Default: <strong>{token?.masa_berlaku || '00:15:00'}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 rounded-xl p-5 flex items-start gap-4 text-xs text-purple-900 dark:text-purple-200">
                    <Info className="size-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-purple-950 dark:text-purple-100">Petunjuk Proktor / Pengawas Ruangan</h4>
                        <p>1. Token diumumkan kepada siswa di dalam ruangan hanya saat sesi ujian siap dimulai.</p>
                        <p>2. Jika peserta keluar karena gangguan perangkat atau jaringan, token yang sama dapat digunakan kembali sebelum masa berlakunya habis.</p>
                        <p>3. Untuk meningkatkan keamanan integritas ujian, Anda dapat mengklik <strong>"Rilis Token Baru"</strong> secara berkala setiap 15 menit.</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
