import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Pagination, { PaginatedData } from '@/components/pagination';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    Clock,
    Globe,
    Lock,
    RefreshCw,
    Search,
    UserCheck,
    Users,
    Wifi,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Status Peserta', href: '/admin/status-peserta' },
];

interface StatusPesertaProps {
    peserta: PaginatedData | any[];
    recentLogs: any[];
    kelasOptions: any[];
    stats: {
        total: number;
        mengerjakan: number;
        selesai: number;
        online: number;
    };
    filters: {
        search?: string;
        kelas?: string;
        status?: string;
    };
}

export default function StatusPesertaIndex({
    peserta = [],
    recentLogs = [],
    kelasOptions = [],
    stats = { total: 0, mengerjakan: 0, selesai: 0, online: 0 },
    filters = {},
}: StatusPesertaProps) {
    const pesertaList = Array.isArray(peserta) ? peserta : (peserta?.data || []);
    const paginationLinks = Array.isArray(peserta) ? [] : (peserta?.links || []);
    const from = Array.isArray(peserta) ? 1 : peserta?.from;
    const to = Array.isArray(peserta) ? peserta?.length : peserta?.to;
    const total = Array.isArray(peserta) ? peserta?.length : (peserta?.total || 0);

    const [search, setSearch] = useState(filters.search || '');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/status-peserta',
            { search, kelas: selectedKelas, status: selectedStatus },
            { preserveState: true }
        );
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleReset = (id: number) => {
        if (confirm('Yakin ingin mereset status login siswa ini agar dapat login kembali?')) {
            router.post(`/admin/status-peserta/${id}/reset`, {}, { preserveScroll: true });
        }
    };

    const handleFinish = (id: number) => {
        if (confirm('Yakin ingin menyelesaikan ujian siswa ini secara paksa?')) {
            router.post(`/admin/status-peserta/${id}/finish`, {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status Peserta Ujian - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-blue-100 mb-2">
                            <Activity className="size-3.5 animate-pulse text-emerald-300" />
                            Live Monitoring Siswa
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Status Peserta Ujian</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            Pantau siswa yang sedang aktif mengerjakan soal, selesaikan ujian, atau reset sesi login peserta.
                        </p>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm w-fit"
                    >
                        <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Segarkan Status
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Peserta Terdaftar</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Users className="size-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Sedang Mengerjakan</p>
                            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.mengerjakan}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Clock className="size-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Telah Selesai</p>
                            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.selesai}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <CheckCircle2 className="size-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Koneksi Online</p>
                            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.online}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                            <Wifi className="size-5" />
                        </div>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
                    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <Input
                                placeholder="Cari NISN, nama siswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>

                        <select
                            value={selectedKelas}
                            onChange={(e) => {
                                setSelectedKelas(e.target.value);
                                router.get(
                                    '/admin/status-peserta',
                                    { search, kelas: e.target.value, status: selectedStatus },
                                    { preserveState: true }
                                );
                            }}
                            className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 w-full sm:w-auto"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasOptions.map((k) => (
                                <option key={k.id_kelas} value={k.id_kelas}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                router.get(
                                    '/admin/status-peserta',
                                    { search, kelas: selectedKelas, status: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                            className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 w-full sm:w-auto"
                        >
                            <option value="">Semua Status Ujian</option>
                            <option value="mengerjakan">Sedang Mengerjakan</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </form>
                </div>

                {/* Status Table */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="py-3 px-4 w-12">No</th>
                                    <th className="py-3 px-4">Nama Siswa / NISN</th>
                                    <th className="py-3 px-4">Kelas & Sesi</th>
                                    <th className="py-3 px-4">Mulai Ujian</th>
                                    <th className="py-3 px-4">IP Address</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {pesertaList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400">
                                            Tidak ada peserta yang sedang aktif atau riwayat ujian di filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    pesertaList.map((p: any, idx: number) => {
                                        const isFinished = Boolean(p.ujian_selesai);
                                        return (
                                            <tr key={p.id_nilai} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400 text-xs">{(from || 1) + idx}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs uppercase">
                                                            {p.siswa_nama ? p.siswa_nama.charAt(0) : 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                {p.siswa_nama || 'Siswa #' + p.id_siswa}
                                                            </div>
                                                            <div className="text-xs text-gray-400 font-mono">
                                                                NISN: {p.nisn || '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
                                                        {p.id_kelas || '-'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        Sesi: {p.sesi || '1'} | Ruang: {p.ruang || '1'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                                                    {p.ujian_mulai || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-xs font-mono text-gray-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Globe className="size-3 text-gray-400" />
                                                        {p.ipaddress || '127.0.0.1'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {isFinished ? (
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                            Selesai
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 animate-pulse">
                                                            Mengerjakan
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReset(p.id_nilai)}
                                                            title="Reset Login Peserta"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-7 px-2"
                                                        >
                                                            <RefreshCw className="size-3 mr-1" />
                                                            Reset
                                                        </Button>
                                                        {!isFinished && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleFinish(p.id_nilai)}
                                                                title="Selesaikan Ujian Secara Paksa"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7 px-2"
                                                            >
                                                                <Lock className="size-3 mr-1" />
                                                                Selesai
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={paginationLinks} from={from} to={to} total={total} />
                </div>

                {/* Recent Student Login Activity */}
                {recentLogs.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <UserCheck className="size-4 text-purple-600" />
                            Aktivitas Login Siswa Terakhir
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {recentLogs.slice(0, 8).map((log) => (
                                <div
                                    key={log.id_log}
                                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
                                            {log.nama}
                                        </div>
                                        <div className="text-gray-400 text-[11px]">{log.kelas}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-emerald-600 font-semibold">{log.text}</span>
                                        <div className="text-[10px] text-gray-400">{log.date.split(' ')[1]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
