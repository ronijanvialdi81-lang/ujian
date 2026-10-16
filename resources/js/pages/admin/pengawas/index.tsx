import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Shield,
    Trash2,
    UserCog,
} from 'lucide-react';
import Pagination, { PaginatedData } from '@/components/pagination';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Data Administrator', href: '/admin/pengawas' },
];

interface AdministratorProps {
    administrators?: PaginatedData<any> | any[];
    filters?: { search?: string };
}

export default function PengawasIndex({
    administrators,
    filters = {},
}: AdministratorProps) {
    const adminList = Array.isArray(administrators) ? administrators : (administrators?.data || []);
    const paginationLinks = Array.isArray(administrators) ? [] : (administrators?.links || []);
    const from = Array.isArray(administrators) ? 1 : administrators?.from;
    const to = Array.isArray(administrators) ? administrators?.length : administrators?.to;
    const total = Array.isArray(administrators) ? administrators?.length : (administrators?.total || 0);

    const [search, setSearch] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        nip: '',
        nama: '',
        username: '',
        password: '',
        jabatan: 'Proktor Utama',
        level: 'admin',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/pengawas', { search }, { preserveState: true });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/pengawas', formData, {
            onSuccess: () => {
                setIsAddOpen(false);
                setFormData({
                    nip: '',
                    nama: '',
                    username: '',
                    password: '',
                    jabatan: 'Proktor Utama',
                    level: 'admin',
                });
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus administrator / proktor ini?')) {
            router.delete(`/admin/pengawas/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Administrator & Proktor - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-blue-100 mb-2">
                            <Shield className="size-3.5 text-blue-200" />
                            Manajemen Hak Akses Sistem
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Administrator & Proktor</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            Kelola akun administrator, proktor ruangan, dan teknisi server ujian CBT.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md w-fit"
                    >
                        <Plus className="size-4 mr-2" />
                        Tambah Admin / Proktor
                    </Button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                            placeholder="Cari nama, NIP, username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </form>
                    <span className="text-xs text-gray-500">
                        Total Administrator & Proktor: <strong>{total}</strong> akun
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="py-3 px-4 w-12">No</th>
                                    <th className="py-3 px-4">Nama Lengkap</th>
                                    <th className="py-3 px-4">Username Login</th>
                                    <th className="py-3 px-4">NIP</th>
                                    <th className="py-3 px-4">Jabatan</th>
                                    <th className="py-3 px-4">Hak Akses (Level)</th>
                                    <th className="py-3 px-4 text-right w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {adminList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-400">
                                             Tidak ada data administrator atau proktor.
                                        </td>
                                    </tr>
                                ) : (
                                    adminList.map((admin: any, idx: number) => (
                                        <tr key={admin.id_pengawas || admin.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                            <td className="py-3 px-4 text-gray-400 text-xs">{(from || 1) + idx}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                    <div className="size-7 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center font-bold text-xs uppercase">
                                                        {(admin.nama || admin.name || 'A').charAt(0)}
                                                    </div>
                                                    <span>{admin.nama || admin.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-mono font-medium text-purple-600">
                                                {admin.username || admin.email}
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                                                {admin.nip || '-'}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-xs">
                                                {admin.jabatan || 'Administrator CBT'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 uppercase text-[10px]"
                                                >
                                                    {admin.level || 'Admin'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(admin.id_pengawas || admin.id)}
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
                    <Pagination links={paginationLinks} from={from} to={to} total={total} />
                </div>
            </div>

            {/* Modal Tambah Administrator */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Administrator / Proktor</DialogTitle>
                        <DialogDescription>
                            Daftarkan akun pengawas ruangan atau proktor teknis CBT.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-3.5 py-2">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                            <Input
                                required
                                placeholder="cth: Ahmad Fauzi, S.Kom"
                                value={formData.nama}
                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Username Login</label>
                                <Input
                                    required
                                    placeholder="cth: proktor1"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                                <Input
                                    required
                                    type="password"
                                    placeholder="minimal 4 karakter"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">NIP (Opsional)</label>
                                <Input
                                    placeholder="cth: 1985..."
                                    value={formData.nip}
                                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Jabatan</label>
                                <Input
                                    placeholder="cth: Proktor Lab 1"
                                    value={formData.jabatan}
                                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                                Simpan Akun
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
