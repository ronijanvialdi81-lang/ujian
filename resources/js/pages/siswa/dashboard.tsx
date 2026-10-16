import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Award,
    Calendar,
    CheckCircle,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    GraduationCap,
    HelpCircle,
    Play,
    Sparkles,
} from 'lucide-react';

interface SiswaStats {
    ujian_tersedia: number;
    ujian_selesai: number;
    rata_rata_nilai: number;
}

export interface UjianItem {
    id_ujian: number;
    nama: string;
    kode_ujian: string;
    mapel: string;
    lama_ujian: number;
    jml_soal: number;
    jml_esai: number;
    token_required: boolean;
    status_siswa: 'belum' | 'sedang' | 'selesai';
    nilai?: string | null;
}

interface SiswaDashboardProps {
    stats: SiswaStats;
    daftarUjian?: UjianItem[];
    siswa?: {
        nama: string;
        nis: string;
        nisn: string;
        kelas: string;
        ruang: string;
        sesi: string;
    } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Siswa',
        href: '/siswa/dashboard',
    },
];

export default function SiswaDashboard({
    stats,
    daftarUjian = [],
    siswa,
}: SiswaDashboardProps) {
    const { auth } = usePage<SharedData>().props;

    // Determine featured exam to highlight
    const activeExam =
        daftarUjian.find((u) => u.status_siswa !== 'selesai') || daftarUjian[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Siswa - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Student Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-inner">
                                <GraduationCap className="size-9 text-cyan-200" />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                                    <Sparkles className="size-3 text-amber-300" />
                                    <span>Peserta Ujian Resmi</span>
                                </div>
                                <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
                                    {siswa?.nama || auth.user.name}
                                </h1>
                                <p className="text-xs text-blue-100 font-medium">
                                    NISN: <span className="font-mono">{siswa?.nisn || auth.user.username || '20261001'}</span> • {siswa?.kelas || 'Kelas X MIPA 1'} • Ruang {siswa?.ruang || '1'} (Sesi {siswa?.sesi || '1'})
                                </p>
                            </div>
                        </div>

                        {/* Quick Status Pill */}
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md text-right">
                                <div className="text-xs text-blue-200">Status Token Ruang:</div>
                                <div className="font-mono text-base font-bold text-emerald-300 tracking-wider">
                                    CBT-AKTIF
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Active Exam Banner */}
                {activeExam ? (
                    <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card to-background p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                    {activeExam.status_siswa === 'sedang'
                                        ? 'Ujian Sedang Berlangsung'
                                        : activeExam.status_siswa === 'selesai'
                                        ? 'Ujian Telah Selesai'
                                        : 'Ujian Siap Dikerjakan'}
                                </div>
                                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                    {activeExam.mapel}
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                                    {activeExam.nama} ({activeExam.kode_ujian}). Pastikan koneksi stabil dan siapkan diri sebelum menekan tombol mulai.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
                                    <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
                                        <Clock className="size-3.5 text-indigo-500" />
                                        <span>Durasi: {activeExam.lama_ujian} Menit</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
                                        <FileSpreadsheet className="size-3.5 text-indigo-500" />
                                        <span>{activeExam.jml_soal} Soal PG {activeExam.jml_esai > 0 ? `+ ${activeExam.jml_esai} Esai` : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
                                        <Calendar className="size-3.5 text-indigo-500" />
                                        <span>Token: {activeExam.token_required ? 'Wajib Token Ruang' : 'Tanpa Token'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                                {activeExam.status_siswa === 'selesai' ? (
                                    <Link href={`/siswa/ujian/${activeExam.id_ujian}/selesai`}>
                                        <Button
                                            type="button"
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-6 rounded-2xl shadow-md gap-2"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            <span>Lihat Hasil Nilai</span>
                                        </Button>
                                    </Link>
                                ) : activeExam.status_siswa === 'sedang' ? (
                                    <Link href={`/siswa/ujian/${activeExam.id_ujian}/kerjakan`}>
                                        <Button
                                            type="button"
                                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-amber-600/30 gap-2 transition hover:scale-[1.02]"
                                        >
                                            <Play className="size-4 fill-current" />
                                            <span>Lanjutkan Ujian</span>
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={`/siswa/ujian/${activeExam.id_ujian}/konfirmasi`}>
                                        <Button
                                            type="button"
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 gap-2 transition hover:scale-[1.02]"
                                        >
                                            <Play className="size-4 fill-current" />
                                            <span>Mulai Ujian Sekarang</span>
                                        </Button>
                                    </Link>
                                )}
                                <span className="text-[11px] text-center text-muted-foreground">
                                    Sistem Lembar Ujian CBT
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Student Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Ujian Tersedia
                            </span>
                            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
                                <Clock className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight">{stats.ujian_tersedia}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Jadwal ujian yang terdaftar</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Ujian Selesai
                            </span>
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {stats.ujian_selesai}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Telah dikerjakan dan tersimpan</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Rata-rata Nilai
                            </span>
                            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                                <Award className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-3xl font-bold tracking-tight">{stats.rata_rata_nilai}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Skor rata-rata ujian selesai</p>
                        </div>
                    </div>
                </div>

                {/* Exam Schedule & Rules Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* All Exams List (2 cols) */}
                    <div className="lg:col-span-2 rounded-2xl border border-sidebar-border/70 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between pb-4 border-b border-border/50">
                            <div>
                                <h3 className="text-base font-semibold">Daftar Jadwal Ujian Saya</h3>
                                <p className="text-xs text-muted-foreground">Pilih ujian untuk mulai mengerjakan lembar soal CBT</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {daftarUjian.length === 0 ? (
                                <div className="text-center py-8 text-xs text-muted-foreground">
                                    Belum ada jadwal ujian yang dipublikasikan.
                                </div>
                            ) : (
                                daftarUjian.map((item) => (
                                    <div
                                        key={item.id_ujian}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground">
                                                    {item.mapel}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] uppercase font-bold ${
                                                        item.status_siswa === 'selesai'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : item.status_siswa === 'sedang'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}
                                                >
                                                    {item.status_siswa === 'selesai'
                                                        ? 'Selesai'
                                                        : item.status_siswa === 'sedang'
                                                        ? 'Sedang Berjalan'
                                                        : 'Tersedia'}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.nama} • {item.lama_ujian} Menit • {item.jml_soal} Soal PG
                                                {item.nilai ? ` • Nilai: ${item.nilai}` : ''}
                                            </div>
                                        </div>

                                        <div>
                                            {item.status_siswa === 'selesai' ? (
                                                <Link href={`/siswa/ujian/${item.id_ujian}/selesai`}>
                                                    <Button variant="outline" size="sm" className="text-xs font-bold gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                                        <span>Lihat Hasil</span>
                                                        <ArrowRight className="size-3.5" />
                                                    </Button>
                                                </Link>
                                            ) : item.status_siswa === 'sedang' ? (
                                                <Link href={`/siswa/ujian/${item.id_ujian}/kerjakan`}>
                                                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1">
                                                        <span>Lanjutkan</span>
                                                        <ArrowRight className="size-3.5" />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Link href={`/siswa/ujian/${item.id_ujian}/konfirmasi`}>
                                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1">
                                                        <span>Kerjakan</span>
                                                        <ArrowRight className="size-3.5" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Rules & Warnings (1 col) */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 pb-4 border-b border-border/50 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="size-5" />
                                <div>
                                    <h3 className="text-base font-semibold text-foreground">Tata Tertib Ujian</h3>
                                    <p className="text-xs text-muted-foreground">Harap diperhatikan dengan seksama</p>
                                </div>
                            </div>

                            <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-foreground">1.</span>
                                    <span>Dilarang keras membuka tab, jendela baru, atau aplikasi lain saat ujian.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-foreground">2.</span>
                                    <span>Sistem merekam setiap aktivitas kecurangan atau pergantian jendela layar.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-foreground">3.</span>
                                    <span>Jawaban Anda tersimpan otomatis setiap kali memilih opsi atau berpindah nomor.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-foreground">4.</span>
                                    <span>Jika terjadi gangguan teknis atau mati listrik, hubungi proktor ruang ujian.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground flex items-center gap-2">
                            <HelpCircle className="size-4 shrink-0 text-indigo-500" />
                            <span>Perlu bantuan? Laporkan ke proktor ruang ujian.</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
