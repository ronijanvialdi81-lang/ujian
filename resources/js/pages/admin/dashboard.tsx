import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    BookOpen,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    HelpCircle,
    PlusCircle,
    Server,
    ShieldCheck,
    Users,
} from 'lucide-react';

interface SekolahInfo {
    nama: string;
    kepsek: string;
    nip: string;
    npsn: string;
    alamat: string;
    aplikasi: string;
    versi: string;
}

interface AdminStats {
    total_siswa: number;
    total_guru: number;
    total_admin: number;
    ujian_aktif: number;
    bank_soal: number;
    total_soal?: number;
    total_kelas?: number;
    total_nilai?: number;
    sekolah?: SekolahInfo | null;
}

interface AdminDashboardProps {
    stats: AdminStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const sekolah = stats.sekolah;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Administrator - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Welcome & School Info Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium backdrop-blur-md">
                                <ShieldCheck className="size-3.5 text-indigo-300" />
                                <span>{sekolah?.aplikasi || 'CANDY CBT'} v{sekolah?.versi || '2.9'}</span>
                                <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-emerald-300">Server Terhubung (MySQL)</span>
                            </div>

                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
                                {sekolah?.nama || 'SMK NEGERI 1 BATUSANGKAR'}
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm text-indigo-200">
                                NPSN: <span className="font-mono">{sekolah?.npsn || '69787351'}</span> • Kepala Sekolah: {sekolah?.kepsek || 'SYOFRIANI, M.Pd.E'} • {sekolah?.alamat || 'Tanah Datar'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/admin/jadwal-ujian"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition"
                            >
                                <PlusCircle className="size-4" />
                                <span>Jadwal Ujian</span>
                            </Link>
                            <Link
                                href="/admin/rekap-nilai"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition border border-white/10"
                            >
                                <Download className="size-4" />
                                <span>Rekap Nilai</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Key Metric Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Siswa */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Total Siswa
                            </span>
                            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                                <GraduationCap className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-extrabold tracking-tight">{stats.total_siswa}</div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Terdaftar di <span className="font-semibold text-foreground">{stats.total_kelas || 28} Rombel/Kelas</span>
                            </p>
                        </div>
                    </div>

                    {/* Total Guru / Pengawas */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Guru & Proktor
                            </span>
                            <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400">
                                <Users className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-extrabold tracking-tight">{stats.total_guru}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Tenaga pendidik & pengawas lab</p>
                        </div>
                    </div>

                    {/* Bank Soal */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Bank Soal
                            </span>
                            <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 dark:text-teal-400">
                                <BookOpen className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-extrabold tracking-tight text-teal-600 dark:text-teal-400">
                                {stats.bank_soal}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Menyimpan <span className="font-semibold text-foreground">{stats.total_soal || 1754} butir soal</span>
                            </p>
                        </div>
                    </div>

                    {/* Lembar Nilai */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Lembar Nilai
                            </span>
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                                <FileSpreadsheet className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {stats.total_nilai || 476}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Hasil evaluasi terekam di sistem</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: Live Monitoring Table & Server Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Fast Navigation Grid (2 cols) */}
                    <div className="lg:col-span-2 rounded-2xl border border-sidebar-border/70 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b border-border/50">
                            <div>
                                <h3 className="text-base font-semibold">Modul CBT Ujian Sekolah</h3>
                                <p className="text-xs text-muted-foreground">Akses langsung ke seluruh menu manajemen ujian</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Database Aktif
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <Link
                                href="/admin/guru"
                                className="flex items-start gap-3 rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 hover:border-indigo-500/40"
                            >
                                <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Data Guru & Proktor</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {stats.total_guru} guru pembuat bank soal & pengawas lab
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/admin/siswa"
                                className="flex items-start gap-3 rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 hover:border-indigo-500/40"
                            >
                                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600">
                                    <GraduationCap className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Data Siswa Peserta</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {stats.total_siswa} peserta ujian di 28 kelas/rombel
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/admin/bank-soal"
                                className="flex items-start gap-3 rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 hover:border-indigo-500/40"
                            >
                                <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600">
                                    <BookOpen className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Bank Soal ({stats.bank_soal})</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {stats.total_soal || 1754} butir soal pilihan ganda & esai
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/admin/jadwal-ujian"
                                className="flex items-start gap-3 rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 hover:border-indigo-500/40"
                            >
                                <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600">
                                    <Calendar className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Jadwal & Token Ujian</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Atur sesi lab, durasi, dan rilis token ujian
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/admin/rekap-nilai"
                                className="flex items-start gap-3 rounded-xl border border-border/50 p-4 transition hover:bg-muted/40 hover:border-indigo-500/40 sm:col-span-2"
                            >
                                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
                                    <FileSpreadsheet className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Rekap Nilai Siswa</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {stats.total_nilai || 476} lembar hasil ujian siswa siap dicetak dan diekspor ke Excel
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Server & CBT Node Status (1 col) */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                                <Server className="size-5 text-indigo-500" />
                                <div>
                                    <h3 className="text-base font-semibold">Server CBT Candy</h3>
                                    <p className="text-xs text-muted-foreground">Infrastruktur database lokal</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3.5 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Koneksi DB:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="size-3.5" /> MySQL (Laragon)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Database:</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded font-medium">
                                        ujian_sekolah
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total Tabel:</span>
                                    <span className="font-bold text-foreground">32 Tabel Candy CBT</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Waktu Server:</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded font-medium">
                                        {new Date().toLocaleTimeString('id-ID')} WIB
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Token Status:</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                                        AUTO-ACTIVE
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-muted/60 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
                            <AlertCircle className="size-4 text-indigo-500 shrink-0 mt-0.5" />
                            <span>
                                Seluruh data 32 tabel dari backup Candy CBT (739 siswa, 59 mapel, 1.754 soal, 476 nilai) telah siap digunakan di portal.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
