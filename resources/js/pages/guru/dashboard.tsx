import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calendar,
    CheckSquare,
    Clock,
    FileEdit,
    FileText,
    GraduationCap,
    PenTool,
    Plus,
    Users,
} from 'lucide-react';

interface GuruStats {
    bank_soal_saya: number;
    ujian_aktif: number;
    total_peserta: number;
    menunggu_koreksi: number;
}

interface GuruDashboardProps {
    stats: GuruStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Guru',
        href: '/guru/dashboard',
    },
];

export default function GuruDashboard({ stats }: GuruDashboardProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Guru - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                                <PenTool className="size-3.5 text-emerald-300" />
                                <span>Panel Guru & Pembuat Soal</span>
                            </div>
                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
                                Halo, {auth.user.name}
                            </h1>
                            <p className="mt-1 text-sm text-teal-100">
                                Buat dan kelola bank soal, pantau keaktifan peserta, serta lakukan koreksi ujian dengan mudah.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition"
                            >
                                <Plus className="size-4" />
                                <span>Buat Bank Soal</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Bank Soal */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Bank Soal Saya
                            </span>
                            <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 dark:text-teal-400">
                                <BookOpen className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight">{stats.bank_soal_saya}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Paket soal aktif diampu</p>
                        </div>
                    </div>

                    {/* Ujian Aktif */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Ujian Berjalan
                            </span>
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                                <Calendar className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {stats.ujian_aktif}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Jadwal berlangsung hari ini</p>
                        </div>
                    </div>

                    {/* Total Siswa Mengerjakan */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Peserta Ujian
                            </span>
                            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                                <Users className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight">{stats.total_peserta}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Siswa di semua kelas Anda</p>
                        </div>
                    </div>

                    {/* Koreksi Esai */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Perlu Dikoreksi
                            </span>
                            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                                <CheckSquare className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                {stats.menunggu_koreksi}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Jawaban esai belum dinilai</p>
                        </div>
                    </div>
                </div>

                {/* Question Bank & Active Tests Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daftar Paket Soal */}
                    <div className="lg:col-span-2 rounded-2xl border border-sidebar-border/70 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b border-border/50">
                            <div>
                                <h3 className="text-base font-semibold">Paket Soal Terdaftar</h3>
                                <p className="text-xs text-muted-foreground">Daftar bank soal yang siap diujikan</p>
                            </div>
                            <button className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                                Lihat Semua Soal
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 dark:text-teal-400">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-sm">
                                            Matematika Wajib - Penilaian Akhir Semester
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Kelas X • 40 Soal Pilihan Ganda, 5 Soal Esai • 90 Menit
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        Siap Digunakan
                                    </span>
                                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition">
                                        <FileEdit className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 dark:text-teal-400">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-sm">
                                            Matematika Peminatan - Ulangan Harian Bab 2
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Kelas XI MIPA • 25 Soal PG • 60 Menit
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                                        Terjadwal
                                    </span>
                                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition">
                                        <FileEdit className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 dark:text-teal-400">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-sm">
                                            Try Out Ujian Sekolah - Seri A
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Kelas XII • 40 Soal PG • 120 Menit
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Draft (35/40 Soal)
                                    </span>
                                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition">
                                        <FileEdit className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Koreksi & Quick Actions */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                                <Award className="size-5 text-emerald-500" />
                                <div>
                                    <h3 className="text-base font-semibold">Tugas Penilaian</h3>
                                    <p className="text-xs text-muted-foreground">Koreksi lembar jawaban esai</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/20">
                                    <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                                        <span>PAS Matematika X MIPA 1</span>
                                        <span>15 Esai</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Siswa telah menyelesaikan ujian, menunggu verifikasi penilaian guru.
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-3 w-full rounded-lg bg-amber-600 hover:bg-amber-500 py-1.5 text-xs font-semibold text-white transition text-center"
                                    >
                                        Mulai Koreksi Sekarang
                                    </button>
                                </div>

                                <div className="text-xs space-y-2 text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                        <span>Passing Grade (KKM):</span>
                                        <span className="font-semibold text-foreground">75</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Tingkat Kelulusan:</span>
                                        <span className="font-semibold text-emerald-600">92.4%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                            💡 Tips: Nilai otomatis dihitung untuk soal pilihan ganda segera setelah siswa klik selesai.
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
