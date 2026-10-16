import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    HelpCircle,
    KeyRound,
    Play,
    ShieldAlert,
    UserCheck,
} from 'lucide-react';

interface KonfirmasiProps {
    ujian: {
        id_ujian: number;
        nama: string;
        kode_ujian: string;
        mapel: string;
        guru: string;
        lama_ujian: number;
        jml_soal: number;
        jml_esai: number;
        token_required: boolean;
    };
    siswa: {
        id_siswa: number;
        nama: string;
        nis: string;
        nisn: string;
        kelas: string;
        sesi: string;
        ruang: string;
    };
    serverToken?: string;
    errors?: Record<string, string>;
}

export default function KonfirmasiUjian({
    ujian,
    siswa,
    serverToken = '',
    errors = {},
}: KonfirmasiProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/siswa/dashboard' },
        { title: 'Konfirmasi Ujian', href: `/siswa/ujian/${ujian.id_ujian}/konfirmasi` },
    ];

    const { data, setData, post, processing, errors: formErrors } = useForm({
        token: serverToken || '',
    });

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/siswa/ujian/${ujian.id_ujian}/mulai`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Konfirmasi Ujian - ${ujian.mapel}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
                {/* Back Button */}
                <div className="flex items-center">
                    <Link
                        href="/siswa/dashboard"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Dashboard
                    </Link>
                </div>

                {/* Hero Header */}
                <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md text-cyan-200 mb-2">
                                <KeyRound className="size-3.5" />
                                <span>Verifikasi Ruang Ujian CBT</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                {ujian.mapel}
                            </h1>
                            <p className="text-blue-100 text-xs sm:text-sm mt-1">
                                Kode: <span className="font-mono font-bold text-amber-300">{ujian.kode_ujian || ujian.nama}</span> • Guru: {ujian.guru}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md text-left sm:text-right">
                                <div className="text-[11px] text-blue-200">Durasi Pengerjaan:</div>
                                <div className="font-bold text-lg text-emerald-300 flex items-center gap-1 sm:justify-end">
                                    <Clock className="size-4" />
                                    <span>{ujian.lama_ujian} Menit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Participant & Exam Details (2 cols) */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Student Information Card */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-xs">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 font-bold text-sm">
                                <UserCheck className="size-4 text-indigo-600" />
                                <span>Identitas Peserta Ujian</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Nama Siswa</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                                        {siswa.nama}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">NISN / Nomor Peserta</span>
                                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                                        {siswa.nisn}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Kelas / Jurusan</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {siswa.kelas || 'X MIPA 1'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-0.5">Ruang & Sesi</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        Ruang {siswa.ruang || '1'} (Sesi {siswa.sesi || '1'})
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Exam Specifications Card */}
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-xs">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 font-bold text-sm">
                                <FileSpreadsheet className="size-4 text-indigo-600" />
                                <span>Rincian Soal & Aturan Teknis</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3.5 border border-gray-100 dark:border-gray-800">
                                    <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                        {ujian.jml_soal}
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">Pilihan Ganda</div>
                                </div>

                                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3.5 border border-gray-100 dark:border-gray-800">
                                    <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                                        {ujian.jml_esai || 0}
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">Soal Esai</div>
                                </div>

                                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3.5 border border-gray-100 dark:border-gray-800">
                                    <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {ujian.lama_ujian}'
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">Alokasi Waktu</div>
                                </div>
                            </div>

                            <ul className="mt-5 space-y-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Jawaban Anda disimpan secara real-time setiap kali memilih opsi atau berpindah nomor.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Tersedia penanda ragu-ragu jika Anda belum yakin dengan jawaban yang dipilih.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ShieldAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Waktu ujian akan terus berjalan dan otomatis dikumpulkan saat waktu habis.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Token Input & Action Form (1 col) */}
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-white dark:bg-gray-900 border-2 border-indigo-500/20 p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm mb-2">
                                    <KeyRound className="size-4.5" />
                                    <span>Konfirmasi Masuk Ujian</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                                    Pastikan identitas peserta di samping telah sesuai dengan kartu ujian Anda.
                                </p>

                                <form onSubmit={handleStart} className="space-y-4">
                                    {ujian.token_required && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                    Token Ujian Ruang
                                                </label>
                                                {serverToken && (
                                                    <span className="text-[10px] text-indigo-600 font-mono">
                                                        Token Aktif: {serverToken}
                                                    </span>
                                                )}
                                            </div>

                                            <Input
                                                required
                                                placeholder="Masukkan 6 digit token"
                                                value={data.token}
                                                onChange={(e) => setData('token', e.target.value.toUpperCase())}
                                                className="uppercase font-mono text-center tracking-widest text-base font-bold h-11 border-indigo-200 dark:border-indigo-800"
                                            />

                                            {(formErrors.token || errors.token) && (
                                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="size-3.5" />
                                                    {formErrors.token || errors.token}
                                                </p>
                                            )}

                                            <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                                                <HelpCircle className="size-3" />
                                                <span>Dapatkan token dari proktor / pengawas ujian di ruang Anda.</span>
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        <Play className="size-4 fill-current" />
                                        <span>{processing ? 'Menyiapkan Soal...' : 'Mulai Kerjakan Ujian'}</span>
                                    </Button>
                                </form>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                                <span className="text-[11px] text-gray-400">
                                    Sistem Ujian Terintegrasi • CBT v3.0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
