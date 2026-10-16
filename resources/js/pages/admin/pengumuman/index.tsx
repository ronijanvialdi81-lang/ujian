import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    Megaphone,
    Pencil,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import Pagination, { PaginatedData } from '@/components/pagination';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengumuman', href: '/admin/pengumuman' },
];

interface PengumumanProps {
    pengumuman?: PaginatedData<any> | any[];
}

export default function PengumumanIndex({ pengumuman }: PengumumanProps) {
    const pengumumanList = Array.isArray(pengumuman) ? pengumuman : (pengumuman?.data || []);
    const paginationLinks = Array.isArray(pengumuman) ? [] : (pengumuman?.links || []);
    const from = Array.isArray(pengumuman) ? 1 : pengumuman?.from;
    const to = Array.isArray(pengumuman) ? pengumuman?.length : pengumuman?.to;
    const total = Array.isArray(pengumuman) ? pengumuman?.length : (pengumuman?.total || 0);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [judul, setJudul] = useState('');
    const [text, setText] = useState('');
    const [type, setType] = useState('eksternal');

    const openAddModal = () => {
        setEditingItem(null);
        setJudul('');
        setText('');
        setType('eksternal');
        setIsAddOpen(true);
    };

    const openEditModal = (item: any) => {
        setEditingItem(item);
        setJudul(item.judul || '');
        setText(item.text || '');
        setType(item.type || 'eksternal');
        setIsAddOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            router.put(`/admin/pengumuman/${editingItem.id_pengumuman}`, { judul, text, type }, {
                onSuccess: () => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                    setJudul('');
                    setText('');
                },
            });
        } else {
            router.post('/admin/pengumuman', { judul, text, type }, {
                onSuccess: () => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                    setJudul('');
                    setText('');
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pengumuman ini?')) {
            router.delete(`/admin/pengumuman/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengumuman CBT - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-blue-100 mb-2">
                            <Megaphone className="size-3.5 text-amber-300" />
                            Papan Informasi Siswa & Guru
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengumuman CBT</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            Buat dan terbitkan informasi jadwal, tata tertib, dan instruksi ujian sekolah.
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md w-fit"
                    >
                        <Plus className="size-4 mr-2" />
                        Buat Pengumuman
                    </Button>
                </div>

                {/* Announcement Cards */}
                <div className="flex flex-col gap-4">
                    {pengumumanList.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center text-gray-400 border border-gray-100 dark:border-gray-800">
                            Belum ada pengumuman yang diterbitkan.
                        </div>
                    ) : (
                        pengumumanList.map((item: any) => (
                            <div
                                key={item.id_pengumuman}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs transition-all hover:shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 uppercase text-[10px]"
                                        >
                                            {item.type || 'Semua'}
                                        </Badge>
                                        <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                            {item.judul}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-xs text-gray-400 mr-2">
                                            <Calendar className="size-3.5" />
                                            {item.date || '-'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(item)}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 size-7 p-0"
                                            title="Edit Pengumuman"
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(item.id_pengumuman)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/40 size-7 p-0"
                                            title="Hapus Pengumuman"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.text }}
                                />
                            </div>
                        ))
                    )}
                </div>

                <Pagination
                    links={paginationLinks}
                    from={from}
                    to={to}
                    total={total}
                    className="rounded-2xl border border-gray-100 dark:border-gray-800"
                />
            </div>

            {/* Modal Tambah/Edit Pengumuman */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingItem
                                ? 'Perbarui informasi dan isi pengumuman yang dipilih.'
                                : 'Pengumuman ini akan langsung tampil di beranda aplikasi CBT siswa dan pengawas.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Judul Pengumuman</label>
                            <Input
                                required
                                placeholder="cth: INFO JADWAL UJIAN SEKOLAH DARING"
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Target Penerima</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200"
                            >
                                <option value="eksternal">Siswa & Umum (Eksternal)</option>
                                <option value="internal">Guru & Pengawas (Internal)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Isi Pesan Pengumuman</label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Tuliskan isi pengumuman atau tata tertib ujian di sini..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                                {editingItem ? 'Perbarui Pengumuman' : 'Publikasikan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
