import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Pagination, { PaginatedData } from '@/components/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Edit2,
    Mail,
    Phone,
    Plus,
    Search,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface MataPelajaran {
    id: number;
    nama: string;
    kode: string;
}

interface Guru {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string;
    gender?: string;
    status: string;
    mata_pelajaran_id?: number;
    mata_pelajaran?: MataPelajaran;
}

interface Props {
    gurus: PaginatedData<Guru> | Guru[];
    mataPelajarans: MataPelajaran[];
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Data Guru', href: '/admin/guru' },
];

export default function GuruIndex({ gurus, mataPelajarans, filters }: Props) {
    const guruList = Array.isArray(gurus) ? gurus : (gurus?.data || []);
    const paginationLinks = Array.isArray(gurus) ? [] : (gurus?.links || []);
    const from = Array.isArray(gurus) ? 1 : gurus?.from;
    const to = Array.isArray(gurus) ? gurus?.length : gurus?.to;
    const total = Array.isArray(gurus) ? gurus?.length : (gurus?.total || 0);
    const [search, setSearch] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

    const form = useForm({
        name: '',
        username: '',
        email: '',
        mata_pelajaran_id: '',
        gender: 'L',
        phone: '',
        status: 'aktif',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/guru', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingGuru(null);
        form.reset();
        form.clearErrors();
        setIsOpen(true);
    };

    const openEditModal = (guru: Guru) => {
        setEditingGuru(guru);
        form.setData({
            name: guru.name,
            username: guru.username,
            email: guru.email,
            mata_pelajaran_id: guru.mata_pelajaran_id ? String(guru.mata_pelajaran_id) : '',
            gender: guru.gender || 'L',
            phone: guru.phone || '',
            status: guru.status || 'aktif',
        });
        form.clearErrors();
        setIsOpen(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingGuru) {
            form.put(`/admin/guru/${editingGuru.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post('/admin/guru', {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleDelete = (guru: Guru) => {
        if (confirm(`Apakah Anda yakin ingin menghapus guru ${guru.name}?`)) {
            router.delete(`/admin/guru/${guru.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Guru - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header & Stats Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Users className="size-7 text-indigo-600" />
                            <span>Manajemen Data Guru</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola akun tenaga pendidik, pembuat bank soal, dan pengawas ujian CBT.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-sm"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Guru Baru</span>
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari nama, NIP, atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl"
                        />
                    </form>
                    <div className="text-xs text-muted-foreground self-end sm:self-center">
                        Total Guru Terdaftar: <span className="font-semibold text-foreground">{gurus.length} Orang</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3.5 px-4">Nama Guru</th>
                                    <th className="py-3.5 px-4">NIP / Username</th>
                                    <th className="py-3.5 px-4">Mata Pelajaran</th>
                                    <th className="py-3.5 px-4">Kontak</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {guruList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            Tidak ada data guru ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    guruList.map((guru) => (
                                        <tr key={guru.id} className="hover:bg-muted/30 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-foreground flex items-center gap-2">
                                                    <div className="flex size-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-xs">
                                                        {guru.name.charAt(0)}
                                                    </div>
                                                    <span>{guru.name}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <Mail className="size-3 text-muted-foreground" />
                                                    <span>{guru.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-xs text-foreground">
                                                {guru.username}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {guru.mata_pelajaran ? (
                                                    <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400">
                                                        <BookOpen className="size-3" />
                                                        {guru.mata_pelajaran.nama}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        Belum ditentukan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                {guru.phone ? (
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Phone className="size-3" />
                                                        <span>{guru.phone}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        guru.status === 'aktif'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-slate-500/10 text-slate-500'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            guru.status === 'aktif' ? 'bg-emerald-500' : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    {guru.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(guru)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                        title="Edit Data"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(guru)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition"
                                                        title="Hapus Data"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
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

            {/* Create & Edit Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Isi formulir data guru pengajar di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Nama Lengkap & Gelar</Label>
                            <Input
                                id="name"
                                required
                                placeholder="Contoh: Budi Santoso, M.Pd"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="username">NIP / Username</Label>
                                <Input
                                    id="username"
                                    required
                                    placeholder="19850101..."
                                    value={form.data.username}
                                    onChange={(e) => form.setData('username', e.target.value)}
                                />
                                <InputError message={form.errors.username} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="gender">Jenis Kelamin</Label>
                                <select
                                    id="gender"
                                    value={form.data.gender}
                                    onChange={(e) => form.setData('gender', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                                >
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="guru@sekolah.sch.id"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                            <InputError message={form.errors.email} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mata_pelajaran_id">Mata Pelajaran yang Diampu</Label>
                            <select
                                id="mata_pelajaran_id"
                                value={form.data.mata_pelajaran_id}
                                onChange={(e) => form.setData('mata_pelajaran_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="">-- Pilih Mata Pelajaran --</option>
                                {mataPelajarans.map((mp) => (
                                    <option key={mp.id} value={mp.id}>
                                        {mp.nama} ({mp.kode})
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.mata_pelajaran_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">No. Handphone / WA</Label>
                                <Input
                                    id="phone"
                                    placeholder="0812..."
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                />
                                <InputError message={form.errors.phone} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status Akun</Label>
                                <select
                                    id="status"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                                {editingGuru ? 'Simpan Perubahan' : 'Tambahkan Guru'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
