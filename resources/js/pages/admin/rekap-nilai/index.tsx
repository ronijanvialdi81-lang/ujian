import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Pagination, { PaginatedData } from '@/components/pagination';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    GraduationCap,
    Printer,
    Search,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Kelas {
    id: number;
    nama: string;
}

interface Siswa {
    id: number;
    name: string;
    username: string; // NISN
    kelas?: Kelas;
}

interface MataPelajaran {
    id: number;
    nama: string;
}

interface BankSoal {
    id: number;
    judul: string;
    mata_pelajaran?: MataPelajaran;
}

interface JadwalUjian {
    id: number;
    nama_ujian: string;
    bank_soal?: BankSoal;
}

interface RekapNilai {
    id: number;
    jadwal_ujian_id: number;
    jadwal_ujian?: JadwalUjian;
    siswa_id: number;
    siswa?: Siswa;
    jumlah_benar: number;
    jumlah_salah: number;
    nilai_akhir: number;
    status: string;
    waktu_selesai?: string;
}

interface Stats {
    total_ujian: number;
    rata_rata: number;
    total_tuntas: number;
    total_remedial: number;
}

interface Props {
    rekapNilais: PaginatedData<RekapNilai> | RekapNilai[];
    stats: Stats;
    jadwalList: { id: number; nama_ujian: string }[];
    filters: {
        search?: string;
        jadwal_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Rekap Nilai', href: '/admin/rekap-nilai' },
];

export default function RekapNilaiIndex({
    rekapNilais,
    stats,
    jadwalList,
    filters,
}: Props) {
    const rekapList = Array.isArray(rekapNilais) ? rekapNilais : (rekapNilais?.data || []);
    const paginationLinks = Array.isArray(rekapNilais) ? [] : (rekapNilais?.links || []);
    const from = Array.isArray(rekapNilais) ? 1 : rekapNilais?.from;
    const to = Array.isArray(rekapNilais) ? rekapNilais?.length : rekapNilais?.to;
    const total = Array.isArray(rekapNilais) ? rekapNilais?.length : (rekapNilais?.total || 0);
    const [search, setSearch] = useState(filters.search || '');
    const [jadwalId, setJadwalId] = useState(filters.jadwal_id || '');

    const handleFilter = (newSearch?: string, newJadwalId?: string) => {
        router.get(
            '/admin/rekap-nilai',
            {
                search: newSearch !== undefined ? newSearch : search,
                jadwal_id: newJadwalId !== undefined ? newJadwalId : jadwalId,
            },
            { preserveState: true }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        alert('Fitur ekspor rekap nilai ke format Excel/CSV sedang diunduh.');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Nilai Siswa - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <FileSpreadsheet className="size-7 text-indigo-600" />
                            <span>Rekapitulasi Nilai Ujian</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Laporan capaian hasil ujian siswa, tingkat kelulusan, dan statistik nilai sekolah.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="gap-2"
                        >
                            <Printer className="size-4" />
                            <span>Cetak</span>
                        </Button>
                        <Button
                            onClick={handleExport}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-sm"
                        >
                            <Download className="size-4" />
                            <span>Export Excel</span>
                        </Button>
                    </div>
                </div>

                {/* Summary Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Lembar Jawaban Masuk
                            </span>
                            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                <GraduationCap className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold tracking-tight">{stats.total_ujian}</div>
                        <p className="mt-0.5 text-xs text-muted-foreground">Siswa telah menyelesaikan ujian</p>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Rata-rata Nilai
                            </span>
                            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
                                <Award className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                            {stats.rata_rata}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">Passing grade KKM: 75.0</p>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Siswa Tuntas
                            </span>
                            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            {stats.total_tuntas}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">Nilai mencapai standar KKM</p>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Perlu Remedial
                            </span>
                            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                <AlertCircle className="size-4" />
                            </div>
                        </div>
                        <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                            {stats.total_remedial}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">Dibutuhkan jadwal ujian perbaikan</p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama siswa atau NISN..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter(search, jadwalId)}
                                className="pl-9 h-10 rounded-xl"
                            />
                        </div>

                        <select
                            value={jadwalId}
                            onChange={(e) => {
                                setJadwalId(e.target.value);
                                handleFilter(search, e.target.value);
                            }}
                            className="h-10 rounded-xl border border-input bg-card px-3 text-sm focus:border-indigo-500 w-full sm:w-64"
                        >
                            <option value="">Semua Sesi Ujian</option>
                            {jadwalList.map((j) => (
                                <option key={j.id} value={j.id}>
                                    {j.nama_ujian}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-xs text-muted-foreground self-end sm:self-center">
                        Total Data Nilai: <span className="font-semibold text-foreground">{total} Siswa</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3.5 px-4">Nama Siswa & NISN</th>
                                    <th className="py-3.5 px-4">Kelas</th>
                                    <th className="py-3.5 px-4">Sesi & Mata Pelajaran</th>
                                    <th className="py-3.5 px-4 text-center">Jawaban Benar / Salah</th>
                                    <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Waktu Selesai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {rekapList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            Tidak ada data rekap nilai ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    rekapList.map((rekap) => (
                                        <tr key={rekap.id} className="hover:bg-muted/30 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-foreground">
                                                    {rekap.siswa?.name || '-'}
                                                </div>
                                                <div className="font-mono text-xs text-muted-foreground mt-0.5">
                                                    NISN: {rekap.siswa?.username}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                                    {rekap.siswa?.kelas?.nama || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-foreground text-xs">
                                                    {rekap.jadwal_ujian?.nama_ujian || '-'}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {rekap.jadwal_ujian?.bank_soal?.mata_pelajaran?.nama}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="inline-flex items-center gap-2 text-xs font-medium">
                                                    <span className="text-emerald-600 font-mono">
                                                        {rekap.jumlah_benar} Benar
                                                    </span>
                                                    <span>/</span>
                                                    <span className="text-rose-600 font-mono">
                                                        {rekap.jumlah_salah} Salah
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span
                                                    className={`inline-block font-mono text-base font-extrabold px-3 py-1 rounded-xl ${
                                                        rekap.nilai_akhir >= 75
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {Number(rekap.nilai_akhir).toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        rekap.status === 'tuntas'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {rekap.status === 'tuntas' ? (
                                                        <>
                                                            <CheckCircle2 className="size-3" />
                                                            <span>Tuntas</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="size-3" />
                                                            <span>Remedial</span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-xs text-muted-foreground">
                                                {rekap.waktu_selesai
                                                    ? new Date(rekap.waktu_selesai).toLocaleString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      }) + ' WIB'
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={paginationLinks} from={from} to={to} total={total} />
                </div>
            </div>
        </AppLayout>
    );
}
