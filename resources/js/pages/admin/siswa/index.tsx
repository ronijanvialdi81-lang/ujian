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
    Edit2,
    GraduationCap,
    Mail,
    Phone,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Kelas {
    id: number;
    nama: string;
    tingkat: string;
}

interface Siswa {
    id: number;
    name: string;
    username: string; // NISN
    email: string;
    phone?: string;
    gender?: string;
    status: string;
    kelas_id?: number;
    kelas?: Kelas;
}

interface Props {
    siswas: PaginatedData<Siswa> | Siswa[];
    kelasList: Kelas[];
    filters: {
        search?: string;
        kelas_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Data Siswa', href: '/admin/siswa' },
];

export default function SiswaIndex({ siswas, kelasList, filters }: Props) {
    const siswaList = Array.isArray(siswas) ? siswas : (siswas?.data || []);
    const paginationLinks = Array.isArray(siswas) ? [] : (siswas?.links || []);
    const from = Array.isArray(siswas) ? 1 : siswas?.from;
    const to = Array.isArray(siswas) ? siswas?.length : siswas?.to;
    const total = Array.isArray(siswas) ? siswas?.length : (siswas?.total || 0);
    const [search, setSearch] = useState(filters.search || '');
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [isOpen, setIsOpen] = useState(false);
    const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

    const form = useForm({
        name: '',
        username: '',
        email: '',
        kelas_id: '',
        gender: 'L',
        phone: '',
        status: 'aktif',
    });

    const handleFilter = (newSearch?: string, newKelasId?: string) => {
        router.get(
            '/admin/siswa',
            {
                search: newSearch !== undefined ? newSearch : search,
                kelas_id: newKelasId !== undefined ? newKelasId : kelasId,
            },
            { preserveState: true }
        );
    };

    const openCreateModal = () => {
        setEditingSiswa(null);
        form.reset();
        form.clearErrors();
        setIsOpen(true);
    };

    const openEditModal = (siswa: Siswa) => {
        setEditingSiswa(siswa);
        form.setData({
            name: siswa.name,
            username: siswa.username,
            email: siswa.email,
            kelas_id: siswa.kelas_id ? String(siswa.kelas_id) : '',
            gender: siswa.gender || 'L',
            phone: siswa.phone || '',
            status: siswa.status || 'aktif',
        });
        form.clearErrors();
        setIsOpen(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingSiswa) {
            form.put(`/admin/siswa/${editingSiswa.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post('/admin/siswa', {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleDelete = (siswa: Siswa) => {
        if (confirm(`Apakah Anda yakin ingin menghapus siswa ${siswa.name}?`)) {
            router.delete(`/admin/siswa/${siswa.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <GraduationCap className="size-7 text-indigo-600" />
                            <span>Manajemen Data Siswa</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data peserta ujian, penempatan kelas, serta status akun siswa CBT.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-sm"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Siswa Baru</span>
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama, NISN, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter(search, kelasId)}
                                className="pl-9 h-10 rounded-xl"
                            />
                        </div>

                        <select
                            value={kelasId}
                            onChange={(e) => {
                                setKelasId(e.target.value);
                                handleFilter(search, e.target.value);
                            }}
                            className="h-10 rounded-xl border border-input bg-card px-3 text-sm focus:border-indigo-500 w-full sm:w-48"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-xs text-muted-foreground self-end sm:self-center">
                        Total Siswa: <span className="font-semibold text-foreground">{siswas.length} Siswa</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3.5 px-4">Nama Siswa</th>
                                    <th className="py-3.5 px-4">NISN / Username</th>
                                    <th className="py-3.5 px-4">Kelas</th>
                                    <th className="py-3.5 px-4">Jenis Kelamin</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {siswaList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            Tidak ada data siswa ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    siswaList.map((siswa) => (
                                        <tr key={siswa.id} className="hover:bg-muted/30 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-foreground flex items-center gap-2">
                                                    <div className="flex size-7 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 font-bold text-xs">
                                                        {siswa.name.charAt(0)}
                                                    </div>
                                                    <span>{siswa.name}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <Mail className="size-3 text-muted-foreground" />
                                                    <span>{siswa.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-xs text-foreground">
                                                {siswa.username}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {siswa.kelas ? (
                                                    <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                                        {siswa.kelas.nama}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        Belum ditentukan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                {siswa.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        siswa.status === 'aktif'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-slate-500/10 text-slate-500'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            siswa.status === 'aktif' ? 'bg-emerald-500' : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    {siswa.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(siswa)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                        title="Edit Data"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(siswa)}
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
                            {editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Isi data siswa peserta ujian di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Nama Lengkap Siswa</Label>
                            <Input
                                id="name"
                                required
                                placeholder="Contoh: Ahmad Rizky"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="username">NISN / Username</Label>
                                <Input
                                    id="username"
                                    required
                                    placeholder="20261001"
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
                                placeholder="siswa@sekolah.sch.id"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                            <InputError message={form.errors.email} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kelas_id">Rombel / Kelas</Label>
                            <select
                                id="kelas_id"
                                value={form.data.kelas_id}
                                onChange={(e) => form.setData('kelas_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {kelasList.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama} (Tingkat {k.tingkat})
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.kelas_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">No. Telepon / WA</Label>
                                <Input
                                    id="phone"
                                    placeholder="0896..."
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
                                {editingSiswa ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
