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
    Activity,
    Calendar,
    Clock,
    Copy,
    Edit2,
    KeyRound,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface MataPelajaran {
    id: number;
    nama: string;
}

interface BankSoal {
    id: number;
    judul: string;
    durasi_menit: number;
    mata_pelajaran?: MataPelajaran;
}

interface Kelas {
    id: number;
    nama: string;
}

interface JadwalUjian {
    id: number;
    nama_ujian: string;
    bank_soal_id: number;
    bank_soal?: BankSoal;
    kelas_id?: number;
    kelas?: Kelas;
    tanggal_mulai: string;
    tanggal_selesai: string;
    durasi_menit: number;
    token: string;
    status: string;
}

interface Props {
    jadwalUjians: PaginatedData<JadwalUjian> | JadwalUjian[];
    bankSoals: BankSoal[];
    kelasList: Kelas[];
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Jadwal Ujian', href: '/admin/jadwal-ujian' },
];

export default function JadwalUjianIndex({
    jadwalUjians,
    bankSoals,
    kelasList,
    filters,
}: Props) {
    const jadwalList = Array.isArray(jadwalUjians) ? jadwalUjians : (jadwalUjians?.data || []);
    const paginationLinks = Array.isArray(jadwalUjians) ? [] : (jadwalUjians?.links || []);
    const from = Array.isArray(jadwalUjians) ? 1 : jadwalUjians?.from;
    const to = Array.isArray(jadwalUjians) ? jadwalUjians?.length : jadwalUjians?.to;
    const total = Array.isArray(jadwalUjians) ? jadwalUjians?.length : (jadwalUjians?.total || 0);
    const [search, setSearch] = useState(filters.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [editingJadwal, setEditingJadwal] = useState<JadwalUjian | null>(null);

    const form = useForm({
        nama_ujian: '',
        bank_soal_id: '',
        kelas_id: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        durasi_menit: 90,
        token: '',
        status: 'akan_datang',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/jadwal-ujian', { search }, { preserveState: true });
    };

    const generateRandomToken = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let res = '';
        for (let i = 0; i < 6; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        form.setData('token', res);
    };

    const openCreateModal = () => {
        setEditingJadwal(null);
        form.reset();

        const now = new Date();
        const startStr = now.toISOString().slice(0, 16);
        now.setHours(now.getHours() + 2);
        const endStr = now.toISOString().slice(0, 16);

        form.setData({
            nama_ujian: '',
            bank_soal_id: bankSoals[0]?.id ? String(bankSoals[0].id) : '',
            kelas_id: kelasList[0]?.id ? String(kelasList[0].id) : '',
            tanggal_mulai: startStr,
            tanggal_selesai: endStr,
            durasi_menit: 90,
            token: '',
            status: 'akan_datang',
        });
        form.clearErrors();
        setIsOpen(true);
    };

    const openEditModal = (jadwal: JadwalUjian) => {
        setEditingJadwal(jadwal);
        form.setData({
            nama_ujian: jadwal.nama_ujian,
            bank_soal_id: String(jadwal.bank_soal_id),
            kelas_id: jadwal.kelas_id ? String(jadwal.kelas_id) : '',
            tanggal_mulai: jadwal.tanggal_mulai.slice(0, 16),
            tanggal_selesai: jadwal.tanggal_selesai.slice(0, 16),
            durasi_menit: jadwal.durasi_menit,
            token: jadwal.token,
            status: jadwal.status,
        });
        form.clearErrors();
        setIsOpen(true);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingJadwal) {
            form.put(`/admin/jadwal-ujian/${editingJadwal.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            form.post('/admin/jadwal-ujian', {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleDelete = (jadwal: JadwalUjian) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jadwal "${jadwal.nama_ujian}"?`)) {
            router.delete(`/admin/jadwal-ujian/${jadwal.id}`);
        }
    };

    const copyToClipboard = (token: string) => {
        navigator.clipboard.writeText(token);
        alert(`Token ${token} berhasil disalin ke clipboard!`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Ujian - CBT Ujian Sekolah" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Calendar className="size-7 text-indigo-600" />
                            <span>Jadwal Pelaksanaan Ujian</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Atur jadwal pelaksanaan sesi CBT, alokasi kelas peserta, dan rilis token ujian.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-sm"
                    >
                        <Plus className="size-4" />
                        <span>Buat Jadwal Baru</span>
                    </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari nama ujian atau token..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl"
                        />
                    </form>
                    <div className="text-xs text-muted-foreground self-end sm:self-center">
                        Total Jadwal: <span className="font-semibold text-foreground">{jadwalUjians.length} Sesi Ujian</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-3.5 px-4">Nama Ujian</th>
                                    <th className="py-3.5 px-4">Mata Pelajaran & Paket</th>
                                    <th className="py-3.5 px-4">Peserta / Kelas</th>
                                    <th className="py-3.5 px-4">Waktu Pelaksanaan</th>
                                    <th className="py-3.5 px-4">Token Ujian</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {jadwalUjians.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            Tidak ada jadwal ujian ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    jadwalList.map((jadwal) => (
                                        <tr key={jadwal.id} className="hover:bg-muted/30 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-foreground">{jadwal.nama_ujian}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Clock className="size-3" />
                                                    <span>Durasi: {jadwal.durasi_menit} Menit</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="text-foreground font-medium text-xs">
                                                    {jadwal.bank_soal?.mata_pelajaran?.nama || '-'}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                                                    {jadwal.bank_soal?.judul}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                                    {jadwal.kelas?.nama || 'Semua Kelas'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs">
                                                <div className="font-medium text-foreground">
                                                    {new Date(jadwal.tanggal_mulai).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                                <div className="text-muted-foreground text-[11px]">
                                                    {new Date(jadwal.tanggal_mulai).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}{' '}
                                                    -{' '}
                                                    {new Date(jadwal.tanggal_selesai).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}{' '}
                                                    WIB
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(jadwal.token)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/60 hover:bg-muted px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-foreground transition"
                                                    title="Klik untuk salin token"
                                                >
                                                    <KeyRound className="size-3 text-indigo-500" />
                                                    <span>{jadwal.token}</span>
                                                    <Copy className="size-3 text-muted-foreground ml-0.5" />
                                                </button>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        jadwal.status === 'berlangsung'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : jadwal.status === 'akan_datang'
                                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                            : 'bg-slate-500/10 text-slate-500'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${
                                                            jadwal.status === 'berlangsung'
                                                                ? 'bg-emerald-500 animate-pulse'
                                                                : jadwal.status === 'akan_datang'
                                                                ? 'bg-blue-500'
                                                                : 'bg-slate-400'
                                                        }`}
                                                    />
                                                    <span className="capitalize">
                                                        {jadwal.status === 'akan_datang'
                                                            ? 'Akan Datang'
                                                            : jadwal.status}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(jadwal)}
                                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                        title="Edit Data"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(jadwal)}
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
                            {editingJadwal ? 'Edit Jadwal Ujian' : 'Buat Jadwal Ujian Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Tentukan paket soal, alokasi kelas, dan waktu pelaksanaan ujian.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="nama_ujian">Nama Sesi Ujian</Label>
                            <Input
                                id="nama_ujian"
                                required
                                placeholder="Contoh: PAS Matematika Wajib Kelas X"
                                value={form.data.nama_ujian}
                                onChange={(e) => form.setData('nama_ujian', e.target.value)}
                            />
                            <InputError message={form.errors.nama_ujian} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="bank_soal_id">Pilih Paket Bank Soal</Label>
                            <select
                                id="bank_soal_id"
                                required
                                value={form.data.bank_soal_id}
                                onChange={(e) => form.setData('bank_soal_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="">-- Pilih Paket Bank Soal --</option>
                                {bankSoals.map((bs) => (
                                    <option key={bs.id} value={bs.id}>
                                        {bs.judul} ({bs.mata_pelajaran?.nama})
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.bank_soal_id} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kelas_id">Kelas Peserta</Label>
                            <select
                                id="kelas_id"
                                value={form.data.kelas_id}
                                onChange={(e) => form.setData('kelas_id', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="">Semua Kelas</option>
                                {kelasList.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.kelas_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_mulai">Tanggal & Jam Mulai</Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="datetime-local"
                                    required
                                    value={form.data.tanggal_mulai}
                                    onChange={(e) => form.setData('tanggal_mulai', e.target.value)}
                                />
                                <InputError message={form.errors.tanggal_mulai} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="tanggal_selesai">Tanggal & Jam Selesai</Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="datetime-local"
                                    required
                                    value={form.data.tanggal_selesai}
                                    onChange={(e) => form.setData('tanggal_selesai', e.target.value)}
                                />
                                <InputError message={form.errors.tanggal_selesai} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="durasi_menit">Durasi (Menit)</Label>
                                <Input
                                    id="durasi_menit"
                                    type="number"
                                    min="10"
                                    required
                                    value={form.data.durasi_menit}
                                    onChange={(e) => form.setData('durasi_menit', Number(e.target.value))}
                                />
                                <InputError message={form.errors.durasi_menit} />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="token">Token Ujian</Label>
                                    <button
                                        type="button"
                                        onClick={generateRandomToken}
                                        className="text-[11px] text-indigo-600 hover:underline"
                                    >
                                        Acak Token
                                    </button>
                                </div>
                                <Input
                                    id="token"
                                    placeholder="Acak otomatis jika kosong"
                                    value={form.data.token}
                                    onChange={(e) => form.setData('token', e.target.value.toUpperCase())}
                                    className="font-mono uppercase tracking-wider"
                                />
                                <InputError message={form.errors.token} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status">Status Ujian</Label>
                            <select
                                id="status"
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:border-indigo-500"
                            >
                                <option value="akan_datang">Akan Datang</option>
                                <option value="berlangsung">Berlangsung</option>
                                <option value="selesai">Selesai</option>
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
                                {editingJadwal ? 'Simpan Perubahan' : 'Jadwalkan Ujian'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
