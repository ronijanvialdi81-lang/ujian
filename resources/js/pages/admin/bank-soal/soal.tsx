import { Badge } from '@/components/ui/badge';
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
import Pagination, { PaginatedData } from '@/components/pagination';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Edit2,
    FileSpreadsheet,
    FileText,
    HelpCircle,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface SoalItem {
    id_soal: number;
    id_mapel: number;
    nomor: number;
    soal: string;
    jenis: number; // 1: PG, 2: Esai
    pilA?: string;
    pilB?: string;
    pilC?: string;
    pilD?: string;
    pilE?: string;
    jawaban?: string;
}

interface SoalIndexProps {
    bankSoal: {
        id: number;
        kode: string;
        nama: string;
        level: string;
        jml_soal: number;
        jml_esai: number;
    };
    soals: PaginatedData<SoalItem> | SoalItem[];
}

export default function SoalIndex({ bankSoal, soals }: SoalIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Bank Soal', href: '/admin/bank-soal' },
        { title: `Kelola Soal: ${bankSoal.nama}`, href: `/admin/bank-soal/${bankSoal.id}/soal` },
    ];

    const soalList = Array.isArray(soals) ? soals : soals?.data || [];
    const paginationLinks = Array.isArray(soals) ? [] : soals?.links || [];
    const from = Array.isArray(soals) ? 1 : soals?.from;
    const to = Array.isArray(soals) ? soals?.length : soals?.to;
    const total = Array.isArray(soals) ? soals?.length : soals?.total || 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSoal, setEditingSoal] = useState<SoalItem | null>(null);

    const form = useForm({
        nomor: soalList.length + 1,
        jenis: 1,
        soal: '',
        pilA: '',
        pilB: '',
        pilC: '',
        pilD: '',
        pilE: '',
        jawaban: 'A',
    });

    const openCreateModal = () => {
        setEditingSoal(null);
        form.setData({
            nomor: (soalList[soalList.length - 1]?.nomor || total) + 1,
            jenis: 1,
            soal: '',
            pilA: '',
            pilB: '',
            pilC: '',
            pilD: '',
            pilE: '',
            jawaban: 'A',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (soal: SoalItem) => {
        setEditingSoal(soal);
        form.setData({
            nomor: soal.nomor,
            jenis: soal.jenis,
            soal: soal.soal || '',
            pilA: soal.pilA || '',
            pilB: soal.pilB || '',
            pilC: soal.pilC || '',
            pilD: soal.pilD || '',
            pilE: soal.pilE || '',
            jawaban: soal.jawaban || 'A',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSoal) {
            form.put(`/admin/bank-soal/${bankSoal.id}/soal/${editingSoal.id_soal}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            form.post(`/admin/bank-soal/${bankSoal.id}/soal`, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (soal: SoalItem) => {
        if (confirm(`Yakin ingin menghapus butir soal nomor ${soal.nomor}?`)) {
            router.delete(`/admin/bank-soal/${bankSoal.id}/soal/${soal.id_soal}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kelola Butir Soal - ${bankSoal.nama}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto w-full">
                {/* Back button */}
                <div>
                    <Link
                        href="/admin/bank-soal"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Daftar Paket Bank Soal
                    </Link>
                </div>

                {/* Hero Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md text-cyan-200 mb-2">
                            <FileSpreadsheet className="size-3.5" />
                            <span>Butir Soal CBT Terintegrasi</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{bankSoal.nama}</h1>
                        <p className="text-blue-100 text-xs sm:text-sm mt-1">
                            Kode Paket: <span className="font-mono font-bold text-amber-300">{bankSoal.kode}</span> • Tingkat Kelas: {bankSoal.level}
                        </p>
                    </div>

                    <Button
                        onClick={openCreateModal}
                        className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-md w-fit"
                    >
                        <Plus className="size-4 mr-1.5" />
                        Tambah Butir Soal
                    </Button>
                </div>

                {/* Question List */}
                <div className="flex flex-col gap-4">
                    {soalList.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 p-12 text-center bg-white dark:bg-gray-900">
                            <FileText className="size-10 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                                Belum Ada Butir Soal
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                                Paket soal ini belum memiliki butir soal. Klik tombol "Tambah Butir Soal" di atas untuk mulai memasukkan soal ujian.
                            </p>
                            <Button
                                onClick={openCreateModal}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                            >
                                <Plus className="size-4 mr-1" />
                                Masukkan Soal Pertama
                            </Button>
                        </div>
                    ) : (
                        soalList.map((item) => (
                            <div
                                key={item.id_soal}
                                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs hover:shadow-md transition"
                            >
                                {/* Header Soal */}
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <span className="size-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                                            {item.nomor}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] uppercase font-bold ${
                                                item.jenis === 1
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40'
                                                    : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40'
                                            }`}
                                        >
                                            {item.jenis === 1 ? 'Pilihan Ganda' : 'Esai'}
                                        </Badge>
                                        {item.jenis === 1 && (
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                                                <CheckCircle2 className="size-3" />
                                                Kunci: <strong>{item.jawaban || 'A'}</strong>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(item)}
                                            className="text-gray-500 hover:text-indigo-600 size-8 p-0"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(item)}
                                            className="text-gray-500 hover:text-red-600 size-8 p-0"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Pertanyaan Soal */}
                                <div
                                    className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-4 prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.soal }}
                                />

                                {/* Opsi Jawaban (Jika Pilihan Ganda) */}
                                {item.jenis === 1 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {(['A', 'B', 'C', 'D', 'E'] as const).map((opsi) => {
                                            const content = item[`pil${opsi}` as keyof SoalItem] as string | undefined;
                                            if (!content && opsi === 'E') return null;

                                            const isKey = item.jawaban?.toUpperCase() === opsi;

                                            return (
                                                <div
                                                    key={opsi}
                                                    className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                                                        isKey
                                                            ? 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold'
                                                            : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`size-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                                            isKey
                                                                ? 'bg-emerald-600 text-white'
                                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                        }`}
                                                    >
                                                        {opsi}
                                                    </span>
                                                    <span
                                                        className="pt-0.5"
                                                        dangerouslySetInnerHTML={{ __html: content || `Pilihan ${opsi}` }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <Pagination links={paginationLinks} from={from} to={to} total={total} className="rounded-2xl" />
            </div>

            {/* Modal Tambah / Edit Butir Soal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSoal ? `Edit Butir Soal Nomor ${editingSoal.nomor}` : 'Tambah Butir Soal Ujian'}
                        </DialogTitle>
                        <DialogDescription>
                            Masukkan isi pertanyaan dan opsi pilihan jawaban untuk paket {bankSoal.nama}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs">Nomor Soal</Label>
                                <Input
                                    required
                                    type="number"
                                    value={form.data.nomor}
                                    onChange={(e) => form.setData('nomor', parseInt(e.target.value) || 1)}
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Jenis Soal</Label>
                                <select
                                    value={form.data.jenis}
                                    onChange={(e) => form.setData('jenis', parseInt(e.target.value) || 1)}
                                    className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                                >
                                    <option value={1}>Pilihan Ganda (PG)</option>
                                    <option value={2}>Esai / Uraian</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs">Isi Pertanyaan Soal</Label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Tuliskan pertanyaan soal di sini (mendukung teks dan tag HTML)..."
                                value={form.data.soal}
                                onChange={(e) => form.setData('soal', e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {form.data.jenis === 1 && (
                            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <Label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                    Opsi Pilihan Jawaban
                                </Label>

                                {(['A', 'B', 'C', 'D', 'E'] as const).map((opsi) => (
                                    <div key={opsi} className="flex items-center gap-2">
                                        <span className="size-7 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                                            {opsi}
                                        </span>
                                        <Input
                                            required={opsi !== 'E'}
                                            placeholder={`Teks pilihan ${opsi}...`}
                                            value={form.data[`pil${opsi}` as keyof typeof form.data] as string}
                                            onChange={(e) => form.setData(`pil${opsi}` as any, e.target.value)}
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                ))}

                                <div className="pt-2">
                                    <Label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                        Kunci Jawaban yang Benar
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {(['A', 'B', 'C', 'D', 'E'] as const).map((opsi) => (
                                            <button
                                                key={opsi}
                                                type="button"
                                                onClick={() => form.setData('jawaban', opsi)}
                                                className={`size-9 rounded-xl font-bold text-xs transition ${
                                                    form.data.jawaban === opsi
                                                        ? 'bg-emerald-600 text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                                }`}
                                            >
                                                {opsi}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                {editingSoal ? 'Simpan Perubahan' : 'Tambahkan Butir Soal'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
