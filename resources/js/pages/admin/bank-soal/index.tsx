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
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    Edit2,
    FileSpreadsheet,
    FileText,
    Plus,
    Search,
    Trash2,
    UserCheck,
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
}

interface BankSoal {
    id: number;
    kode: string;
    judul: string;
    mata_pelajaran_id: number;
    mata_pelajaran?: MataPelajaran;
    guru_id?: number;
    guru?: Guru;
    tingkat: string;
    jumlah_pg: number;
    jumlah_esai: number;
    durasi_menit: number;
    status: string;
}

interface Props {
    bankSoals: PaginatedData<BankSoal> | BankSoal[];
    mataPelajarans: MataPelajaran[];
    gurus: Guru[];
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Bank Soal', href: '/admin/bank-soal' },
];

export default function BankSoalIndex({
    bankSoals,
    mataPelajarans,
    gurus,
    filters,
}: Props) {
    const soalList = Array.isArray(bankSoals) ? bankSoals : (bankSoals?.data || []);
    const paginationLinks = Array.isArray(bankSoals) ? [] : (bankSoals?.links || []);
    const from = Array.isArray(bankSoals) ? 1 : bankSoals?.from;
    const to = Array.isArray(bankSoals) ? bankSoals?.length : bankSoals?.to;
    const total = Array.isArray(bankSoals) ? bankSoals?.length : (bankSoals?.total || 0);
    const [search, setSearch] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [editingSoal, setEditingSoal] = useState<BankSoal | null>(null);

    const form = useForm({
        kode: '',
        judul: '',
        mata_pelajaran_id: '',
        guru_id: '',
        tingkat: '10',
        jumlah_pg: 40,
        jumlah_esai: 5,
        durasi_menit: 90,
        status: 'aktif',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/bank-soal', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingSoal(null);
        form.reset();
        form.setData({
            kode: `SOAL-${Date.now().toString().slice(-6)}`,
            judul: '',
            mata_pelajaran_id: mataPelajarans[0]?.id ? String(mataPelajarans[0].id) : '',
            guru_id: gurus[0]?.id ? String(gurus[0].id) : '',
            tingkat: '10',
            jumlah_pg: 40,
            jumlah_esai: 5,
            durasi_menit: 90,
            status: 'aktif',
        });
        form.clearErrors();
        setIsOpen(true);
    };

    const openEditModal = (soal: BankSoal) => {
        setEditingSoal(soal);
        form.setData({
            kode: soal.kode,
            judul: soal.judul,
            mata_pelajaran_id: String(soal.mata_pelajaran_id),
            guru_id: soal.guru_id ? String(soal.guru_id) : '',
            tingkat: soal.tingkat,
            jumlah_pg: soal.jumlah_pg,
            jumlah_esai: soal.jumlah_esai,
            durasi_menit: soal.durasi_menit,
            status: soal.status,
        });
        form.clearErrors();
        setIsOpen(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingSoal) {
            form.put(`/admin/bank-soal/${editingSoal.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post('/admin/bank-soal', {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleDelete = (soal: BankSoal) => {
        if (confirm(`Apakah Anda yakin ingin menghapus paket soal "${soal.judul}"?`)) {
            router.delete(`/admin/bank-soal/${soal.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <BookOpen className="size-7 text-indigo-600" />
                            <span>Manajemen Bank Soal</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola paket bank soal ujian, alokasi waktu butir soal, dan guru penyusun soal.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-sm"
                    >
                        <Plus className="size-4" />
                        <span>Buat Paket Soal Baru</span>
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari kode atau judul bank soal..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl"
                        />
                    </form>
                    <div className="text-xs text-muted-foreground self-end sm:self-center">
                        Total Paket Soal: <span className="font-semibold text-foreground">{bankSoals.length} Paket</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3.5 px-4">Paket & Kode Soal</th>
                                    <th className="py-3.5 px-4">Mata Pelajaran</th>
                                    <th className="py-3.5 px-4">Guru Pembuat</th>
                                    <th className="py-3.5 px-4">Butir Soal</th>
                                    <th className="py-3.5 px-4">Durasi</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {soalList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            Tidak ada paket bank soal ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    soalList.map((soal) => (
                                        <tr key={soal.id} className="hover:bg-muted/30 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-foreground">{soal.judul}</div>
                                                <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <span>Kode: {soal.kode}</span>
                                                    <span>•</span>
                                                    <span>Tingkat {soal.tingkat}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400">
                                                    {soal.mata_pelajaran?.nama || '-'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                {soal.guru ? (
                                                    <div className="flex items-center gap-1 text-foreground">
                                                        <UserCheck className="size-3.5 text-indigo-500" />
                                                        <span>{soal.guru.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">Admin</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                <div className="font-medium text-foreground">
                                                    {soal.jumlah_pg} PG + {soal.jumlah_esai} Esai
                                                </div>
                                                <span className="text-muted-foreground text-[11px]">
                                                    Total {soal.jumlah_pg + soal.jumlah_esai} Soal
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    <span>{soal.durasi_menit} Menit</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        soal.status === 'aktif'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : soal.status === 'draft'
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                            : 'bg-slate-500/10 text-slate-500'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            soal.status === 'aktif'
                                                                ? 'bg-emerald-500'
                                                                : soal.status === 'draft'
                                                                ? 'bg-amber-500'
                                                                : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    <span className="capitalize">{soal.status}</span>
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/admin/bank-soal/${soal.id}/soal`}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-bold text-xs transition"
                                                        title="Input & Kelola Butir Soal"
                                                    >
                                                        <FileText className="size-3.5" />
                                                        <span>Kelola Soal</span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(soal)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                        title="Edit Paket"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(soal)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition"
                                                        title="Hapus Paket"
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
                            {editingSoal ? 'Edit Paket Bank Soal' : 'Buat Paket Bank Soal'}
                        </DialogTitle>
                        <DialogDescription>
                            Atur rincian paket soal ujian CBT di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="judul">Judul Paket Soal</Label>
                            <Input
                                id="judul"
                                required
                                placeholder="Contoh: PAS Matematika Wajib Semester 2"
                                value={form.data.judul}
                                onChange={(e) => form.setData('judul', e.target.value)}
                            />
                            <InputError message={form.errors.judul} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="kode">Kode Paket</Label>
                                <Input
                                    id="kode"
                                    required
                                    placeholder="SOAL-MTK-X"
                                    value={form.data.kode}
                                    onChange={(e) => form.setData('kode', e.target.value)}
                                />
                                <InputError message={form.errors.kode} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tingkat">Tingkat Kelas</Label>
                                <select
                                    id="tingkat"
                                    value={form.data.tingkat}
                                    onChange={(e) => form.setData('tingkat', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                                >
                                    <option value="10">Kelas 10 (X)</option>
                                    <option value="11">Kelas 11 (XI)</option>
                                    <option value="12">Kelas 12 (XII)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mata_pelajaran_id">Mata Pelajaran</Label>
                            <select
                                id="mata_pelajaran_id"
                                required
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

                        <div className="space-y-1.5">
                            <Label htmlFor="guru_id">Guru Penyusun Soal</Label>
                            <select
                                id="guru_id"
                                value={form.data.guru_id}
                                onChange={(e) => form.setData('guru_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="">-- Ditentukan Nanti / Admin --</option>
                                {gurus.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.guru_id} />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="jumlah_pg">Jumlah PG</Label>
                                <Input
                                    id="jumlah_pg"
                                    type="number"
                                    min="0"
                                    value={form.data.jumlah_pg}
                                    onChange={(e) => form.setData('jumlah_pg', Number(e.target.value))}
                                />
                                <InputError message={form.errors.jumlah_pg} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="jumlah_esai">Jumlah Esai</Label>
                                <Input
                                    id="jumlah_esai"
                                    type="number"
                                    min="0"
                                    value={form.data.jumlah_esai}
                                    onChange={(e) => form.setData('jumlah_esai', Number(e.target.value))}
                                />
                                <InputError message={form.errors.jumlah_esai} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="durasi_menit">Waktu (Mnt)</Label>
                                <Input
                                    id="durasi_menit"
                                    type="number"
                                    min="10"
                                    value={form.data.durasi_menit}
                                    onChange={(e) => form.setData('durasi_menit', Number(e.target.value))}
                                />
                                <InputError message={form.errors.durasi_menit} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status Paket</Label>
                            <select
                                id="status"
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="aktif">Aktif (Siap Diujikan)</option>
                                <option value="draft">Draft (Belum Selesai)</option>
                                <option value="arsip">Arsip</option>
                            </select>
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
                                {editingSoal ? 'Simpan Perubahan' : 'Buat Paket Soal'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
