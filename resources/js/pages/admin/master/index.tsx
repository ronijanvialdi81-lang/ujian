import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Pagination, { PaginatedData } from '@/components/pagination';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    Building2,
    Clock,
    GraduationCap,
    Layers,
    Plus,
    Search,
    Server,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Data Master', href: '/admin/master' },
];

interface MasterProps {
    activeTab: string;
    search: string;
    counts?: Record<string, number>;
    mapel: PaginatedData | any[];
    kelas: PaginatedData | any[];
    ruang: PaginatedData | any[];
    sesi: PaginatedData | any[];
    jurusan: PaginatedData | any[];
    level: PaginatedData | any[];
    server: PaginatedData | any[];
}

export default function MasterIndex({
    activeTab = 'mapel',
    search = '',
    counts = {},
    mapel = [],
    kelas = [],
    ruang = [],
    sesi = [],
    jurusan = [],
    level = [],
    server = [],
}: MasterProps) {
    const [searchTerm, setSearchTerm] = useState(search);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const mapelList = Array.isArray(mapel) ? mapel : (mapel?.data || []);
    const kelasList = Array.isArray(kelas) ? kelas : (kelas?.data || []);
    const ruangList = Array.isArray(ruang) ? ruang : (ruang?.data || []);
    const sesiList = Array.isArray(sesi) ? sesi : (sesi?.data || []);
    const jurusanList = Array.isArray(jurusan) ? jurusan : (jurusan?.data || []);
    const levelList = Array.isArray(level) ? level : (level?.data || []);
    const serverList = Array.isArray(server) ? server : (server?.data || []);

    const activeDataMap: Record<string, any> = {
        mapel,
        kelas,
        ruang,
        sesi,
        jurusan,
        level,
        server,
    };
    const currentActiveObj = activeDataMap[activeTab];
    const activeLinks = Array.isArray(currentActiveObj) ? [] : (currentActiveObj?.links || []);
    const activeFrom = Array.isArray(currentActiveObj) ? 1 : currentActiveObj?.from;
    const activeTo = Array.isArray(currentActiveObj) ? currentActiveObj?.length : currentActiveObj?.to;
    const activeTotal = counts[activeTab] ?? (Array.isArray(currentActiveObj) ? currentActiveObj?.length : (currentActiveObj?.total || 0));

    const tabs = [
        { id: 'mapel', label: 'Mata Pelajaran', icon: BookOpen, count: counts.mapel ?? mapelList.length },
        { id: 'kelas', label: 'Data Kelas', icon: GraduationCap, count: counts.kelas ?? kelasList.length },
        { id: 'ruang', label: 'Data Ruang', icon: Building2, count: counts.ruang ?? ruangList.length },
        { id: 'sesi', label: 'Data Sesi', icon: Clock, count: counts.sesi ?? sesiList.length },
        { id: 'jurusan', label: 'Jurusan / PK', icon: Briefcase, count: counts.jurusan ?? jurusanList.length },
        { id: 'level', label: 'Level Kelas', icon: Layers, count: counts.level ?? levelList.length },
        { id: 'server', label: 'Server Lokal', icon: Server, count: counts.server ?? serverList.length },
    ];

    const handleTabChange = (tabId: string) => {
        router.get('/admin/master', { tab: tabId }, { preserveState: false });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/master', { tab: activeTab, search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id: string) => {
        if (confirm(`Yakin ingin menghapus data dengan ID: ${id}?`)) {
            router.delete(`/admin/master/${id}`, {
                data: { tab: activeTab },
            });
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/master', { tab: activeTab, ...formData }, {
            onSuccess: () => {
                setIsAddOpen(false);
                setFormData({});
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Master - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Master CBT</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            Kelola referensi mata pelajaran, rombel kelas, ruang, sesi, dan server ujian.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setFormData({});
                            setIsAddOpen(true);
                        }}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm w-fit"
                    >
                        <Plus className="size-4 mr-2" />
                        Tambah Data
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isCurrent = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                    isCurrent
                                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <Icon className="size-4" />
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                                        isCurrent ? 'bg-purple-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                            placeholder={`Cari di ${tabs.find((t) => t.id === activeTab)?.label}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </form>
                    <span className="text-xs text-gray-500">
                        Total {tabs.find((t) => t.id === activeTab)?.label}: <strong>{tabs.find((t) => t.id === activeTab)?.count}</strong> data
                    </span>
                </div>

                {/* Tab Tables */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
                    {activeTab === 'mapel' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode Mapel</th>
                                        <th className="py-3 px-4">Nama Mata Pelajaran</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {mapelList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                                Tidak ada data mata pelajaran.
                                            </td>
                                        </tr>
                                    ) : (
                                        mapelList.map((item: any, idx: number) => (
                                            <tr key={item.kode_mapel} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-purple-600">{item.kode_mapel}</td>
                                                <td className="py-3 px-4 font-medium">{item.nama_mapel}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.kode_mapel)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'kelas' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode / ID Rombel</th>
                                        <th className="py-3 px-4">Nama Kelas</th>
                                        <th className="py-3 px-4">Tingkat / Level</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {kelasList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-400">
                                                Tidak ada data kelas.
                                            </td>
                                        </tr>
                                    ) : (
                                        kelasList.map((item: any, idx: number) => (
                                            <tr key={item.id_kelas} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-blue-600">{item.id_kelas}</td>
                                                <td className="py-3 px-4 font-semibold">{item.nama}</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                        Level {item.level}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id_kelas)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'ruang' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode Ruang</th>
                                        <th className="py-3 px-4">Keterangan / Lokasi</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {ruangList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                                Tidak ada data ruang.
                                            </td>
                                        </tr>
                                    ) : (
                                        ruangList.map((item: any, idx: number) => (
                                            <tr key={item.kode_ruang} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-purple-600">{item.kode_ruang}</td>
                                                <td className="py-3 px-4 font-medium">{item.keterangan}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.kode_ruang)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'sesi' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode Sesi</th>
                                        <th className="py-3 px-4">Nama Sesi</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {sesiList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                                Tidak ada data sesi.
                                            </td>
                                        </tr>
                                    ) : (
                                        sesiList.map((item: any, idx: number) => (
                                            <tr key={item.kode_sesi} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-emerald-600">{item.kode_sesi}</td>
                                                <td className="py-3 px-4 font-medium">{item.nama_sesi}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.kode_sesi)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'jurusan' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode Jurusan / PK</th>
                                        <th className="py-3 px-4">Nama Program Keahlian</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {jurusanList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                                Tidak ada data jurusan / program keahlian.
                                            </td>
                                        </tr>
                                    ) : (
                                        jurusanList.map((item: any, idx: number) => (
                                            <tr key={item.id_pk} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-indigo-600">{item.id_pk}</td>
                                                <td className="py-3 px-4 font-medium">{item.program_keahlian}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id_pk)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'level' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode Level</th>
                                        <th className="py-3 px-4">Keterangan Tingkat</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {levelList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-400">
                                                Tidak ada data level.
                                            </td>
                                        </tr>
                                    ) : (
                                        levelList.map((item: any, idx: number) => (
                                            <tr key={item.kode_level} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-purple-600">{item.kode_level}</td>
                                                <td className="py-3 px-4 font-medium">{item.keterangan}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.kode_level)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'server' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 w-16">No</th>
                                        <th className="py-3 px-4">Kode Server</th>
                                        <th className="py-3 px-4">Nama Server</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {serverList.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-400">
                                                Tidak ada data server lokal.
                                            </td>
                                        </tr>
                                    ) : (
                                        serverList.map((item: any, idx: number) => (
                                            <tr key={item.kode_server} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                                <td className="py-3 px-4 text-gray-400">{(activeFrom || 1) + idx}</td>
                                                <td className="py-3 px-4 font-mono font-medium text-purple-600">{item.kode_server}</td>
                                                <td className="py-3 px-4 font-medium">{item.nama_server}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        item.status === 'aktif' || item.status === '1'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                    }`}>
                                                        {item.status || 'aktif'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.kode_server)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <Pagination links={activeLinks} from={activeFrom} to={activeTo} total={activeTotal} />
                </div>
            </div>

            {/* Add Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Data {tabs.find((t) => t.id === activeTab)?.label}</DialogTitle>
                        <DialogDescription>
                            Isi formulir berikut untuk menambahkan item master baru.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 py-2">
                        {activeTab === 'mapel' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Mapel</label>
                                    <Input
                                        required
                                        placeholder="cth: MTK, BINDO"
                                        value={formData.kode_mapel || ''}
                                        onChange={(e) => setFormData({ ...formData, kode_mapel: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Mata Pelajaran</label>
                                    <Input
                                        required
                                        placeholder="cth: Matematika Wajib"
                                        value={formData.nama_mapel || ''}
                                        onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'kelas' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">ID / Kode Kelas</label>
                                    <Input
                                        required
                                        placeholder="cth: X-TKJ-1"
                                        value={formData.id_kelas || ''}
                                        onChange={(e) => setFormData({ ...formData, id_kelas: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Rombel / Kelas</label>
                                    <Input
                                        required
                                        placeholder="cth: X TKJ 1"
                                        value={formData.nama || ''}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tingkat / Level</label>
                                    <Input
                                        required
                                        placeholder="cth: X, XI, XII"
                                        value={formData.level || ''}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'ruang' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Ruang</label>
                                    <Input
                                        required
                                        placeholder="cth: R01, LAB-1"
                                        value={formData.kode_ruang || ''}
                                        onChange={(e) => setFormData({ ...formData, kode_ruang: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Keterangan / Lokasi</label>
                                    <Input
                                        required
                                        placeholder="cth: Laboratorium Komputer 1"
                                        value={formData.keterangan || ''}
                                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'sesi' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Sesi</label>
                                    <Input
                                        required
                                        placeholder="cth: 1, 2, 3"
                                        value={formData.kode_sesi || ''}
                                        onChange={(e) => setFormData({ ...formData, kode_sesi: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Sesi</label>
                                    <Input
                                        required
                                        placeholder="cth: Sesi 1 (07.30 - 09.30)"
                                        value={formData.nama_sesi || ''}
                                        onChange={(e) => setFormData({ ...formData, nama_sesi: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'jurusan' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Jurusan / PK</label>
                                    <Input
                                        required
                                        placeholder="cth: TKJ, RPL, AKL"
                                        value={formData.id_pk || ''}
                                        onChange={(e) => setFormData({ ...formData, id_pk: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Program Keahlian</label>
                                    <Input
                                        required
                                        placeholder="cth: Teknik Komputer dan Jaringan"
                                        value={formData.program_keahlian || ''}
                                        onChange={(e) => setFormData({ ...formData, program_keahlian: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'level' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Level</label>
                                    <Input
                                        required
                                        placeholder="cth: X, XI, XII"
                                        value={formData.kode_level || ''}
                                        onChange={(e) => setFormData({ ...formData, kode_level: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Keterangan Tingkat</label>
                                    <Input
                                        required
                                        placeholder="cth: Kelas 10 Tingkat Pertama"
                                        value={formData.keterangan || ''}
                                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'server' && (
                            <>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Server</label>
                                    <Input
                                        required
                                        placeholder="cth: SRV-01"
                                        value={formData.kode_server || ''}
                                        onChange={(e) => setFormData({ ...formData, kode_server: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Server</label>
                                    <Input
                                        required
                                        placeholder="cth: Server Ruang Lab 1"
                                        value={formData.nama_server || ''}
                                        onChange={(e) => setFormData({ ...formData, nama_server: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status Server</label>
                                    <Input
                                        required
                                        placeholder="aktif / stand-by"
                                        value={formData.status || 'aktif'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                                Simpan Data
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
