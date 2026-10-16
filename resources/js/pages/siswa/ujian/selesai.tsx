import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    CheckCircle,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    GraduationCap,
    Home,
    RotateCcw,
    XCircle,
} from 'lucide-react';

interface SelesaiUjianProps {
    ujian: {
        id_ujian: number;
        nama: string;
        mapel: string;
        tampil_hasil: boolean;
    };
    nilai?: {
        total: string;
        jml_benar: number;
        jml_salah: number;
        ujian_mulai?: string;
        ujian_selesai?: string;
    } | null;
    siswa: {
        nama: string;
        nisn: string;
        kelas: string;
    };
}

export default function SelesaiUjian({ ujian, nilai, siswa }: SelesaiUjianProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/siswa/dashboard' },
        { title: 'Hasil Ujian', href: `/siswa/ujian/${ujian.id_ujian}/selesai` },
    ];

    const scoreNum = nilai ? parseFloat(nilai.total || '0') : 0;
    const isPassed = scoreNum >= 75;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ujian Selesai - ${ujian.mapel}`} />

            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full min-h-[75vh]">
                <div className="w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-10 shadow-lg text-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

                    {/* Celebration Icon */}
                    <div className="size-20 rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <GraduationCap className="size-11" />
                    </div>

                    <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 uppercase text-[11px] font-bold px-3 py-1 mb-2"
                    >
                        Ujian Telah Diselesaikan
                    </Badge>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Terima Kasih, {siswa.nama}!
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        Jawaban Anda untuk mata pelajaran <strong>{ujian.mapel}</strong> telah berhasil disimpan di server CBT.
                    </p>

                    {/* Score Box if results allowed */}
                    {ujian.tampil_hasil && nilai ? (
                        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/40 max-w-md mx-auto">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Nilai Akhir Ujian
                            </span>

                            <div className="text-5xl font-black text-indigo-700 dark:text-indigo-300 my-2">
                                {scoreNum}
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4">
                                {isPassed ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-0.5 rounded-full">
                                        ✓ Tuntas (Memenuhi KKM)
                                    </span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-0.5 rounded-full">
                                        Perlu Remedial
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-indigo-100/60 dark:border-indigo-900/40 text-xs">
                                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-semibold">
                                    <CheckCircle2 className="size-4" />
                                    <span>Benar: {nilai.jml_benar || 0}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 text-red-500 font-semibold">
                                    <XCircle className="size-4" />
                                    <span>Salah: {nilai.jml_salah || 0}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                            <Clock className="size-5 text-indigo-500 mx-auto mb-2" />
                            Nilai ujian ini akan dipublikasikan oleh pihak sekolah dan guru mata pelajaran setelah seluruh rangkaian sesi ujian selesai.
                        </div>
                    )}

                    {/* Student & Session Info List */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left text-xs max-w-md mx-auto">
                        <div>
                            <span className="text-gray-400 block text-[11px]">NISN</span>
                            <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{siswa.nisn}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block text-[11px]">Kelas</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{siswa.kelas}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <span className="text-gray-400 block text-[11px]">Status</span>
                            <span className="font-semibold text-emerald-600">Selesai Diverifikasi</span>
                        </div>
                    </div>

                    {/* Back to Dashboard Button */}
                    <div className="mt-8">
                        <Link href="/siswa/dashboard">
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 h-12 rounded-xl text-sm gap-2 shadow-lg shadow-indigo-600/20">
                                <Home className="size-4" />
                                <span>Kembali ke Beranda Siswa</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
