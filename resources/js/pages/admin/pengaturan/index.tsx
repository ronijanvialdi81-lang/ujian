import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Check,
    Globe,
    Save,
    School,
    Server,
    Settings,
    UserCheck,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pengaturan CBT', href: '/admin/pengaturan' },
];

interface SettingProps {
    setting: any;
}

export default function PengaturanIndex({ setting }: SettingProps) {
    const [formData, setFormData] = useState({
        sekolah: setting?.sekolah || 'SMK NEGERI 1 BATUSANGKAR',
        kode_sekolah: setting?.kode_sekolah || '10302407',
        jenjang: setting?.jenjang || 'SMK',
        npsn: setting?.npsn || '69787351',
        kepsek: setting?.kepsek || 'SYOFRIANI, M.Pd.E',
        nip: setting?.nip || '197801102005012008',
        alamat: setting?.alamat || 'Jl, Pintu Rayo Saruaso',
        kecamatan: setting?.kecamatan || 'Tanjung Emas',
        kota: setting?.kota || 'Tanah datar',
        telp: setting?.telp || '0752-71063',
        email: setting?.email || 'smkn01batusangkar@gmail.com',
        web: setting?.web || 'smk1batusangkar.sch.id',
        header_kartu: setting?.header_kartu || 'KARTU PESERTA SUMATIF AKHIR SEMESTER GANJIL',
        nama_ujian: setting?.nama_ujian || 'SUMATIF TENGAH SEMESTER',
        ip_server: setting?.ip_server || 'http://192.168.0.200/candycbt',
        id_server: setting?.id_server || 'SR01',
    });

    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post('/admin/pengaturan', formData, {
            onSuccess: () => {
                setIsSaving(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
            onError: () => setIsSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Sekolah & CBT - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-blue-100 mb-2">
                            <Wrench className="size-3.5 text-blue-200" />
                            Konfigurasi Inti CBT
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Sekolah & Server</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            Atur profil lembaga sekolah, tanda tangan kepala sekolah, dan konfigurasi server ujian.
                        </p>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md w-fit"
                    >
                        {saved ? (
                            <>
                                <Check className="size-4 mr-2 text-emerald-600" />
                                Tersimpan!
                            </>
                        ) : (
                            <>
                                <Save className="size-4 mr-2" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Profil Identitas Sekolah */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
                            <School className="size-5 text-purple-600" />
                            <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                Identitas Lembaga / Sekolah
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Sekolah</label>
                                <Input
                                    required
                                    value={formData.sekolah}
                                    onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">NPSN</label>
                                    <Input
                                        value={formData.npsn}
                                        onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kode Sekolah</label>
                                    <Input
                                        value={formData.kode_sekolah}
                                        onChange={(e) => setFormData({ ...formData, kode_sekolah: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Jenjang Pendidikan</label>
                                <Input
                                    placeholder="SD / SMP / SMA / SMK"
                                    value={formData.jenjang}
                                    onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
                                <Input
                                    value={formData.alamat}
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kecamatan</label>
                                <Input
                                    value={formData.kecamatan}
                                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kota / Kabupaten</label>
                                <Input
                                    value={formData.kota}
                                    onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Pimpinan & Pejabat Sekolah */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
                            <UserCheck className="size-5 text-indigo-600" />
                            <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                Kepala Sekolah (Pejabat Penandatangan)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Kepala Sekolah & Gelar</label>
                                <Input
                                    value={formData.kepsek}
                                    onChange={(e) => setFormData({ ...formData, kepsek: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">NIP Kepala Sekolah</label>
                                <Input
                                    value={formData.nip}
                                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Kontak & Media Informasi */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
                            <Globe className="size-5 text-blue-600" />
                            <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                Kontak & Website Sekolah
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                                <Input
                                    value={formData.telp}
                                    onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Resmi</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Alamat Website</label>
                                <Input
                                    value={formData.web}
                                    onChange={(e) => setFormData({ ...formData, web: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Konfigurasi Ujian & Kartu */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
                            <Server className="size-5 text-emerald-600" />
                            <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                Konfigurasi Ujian & Server CBT
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Judul Header Kartu Peserta</label>
                                <Input
                                    value={formData.header_kartu}
                                    onChange={(e) => setFormData({ ...formData, header_kartu: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Evaluasi / Ujian Default</label>
                                <Input
                                    value={formData.nama_ujian}
                                    onChange={(e) => setFormData({ ...formData, nama_ujian: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">IP Host / Server Lokal</label>
                                <Input
                                    value={formData.ip_server}
                                    onChange={(e) => setFormData({ ...formData, ip_server: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">ID Server</label>
                                <Input
                                    value={formData.id_server}
                                    onChange={(e) => setFormData({ ...formData, id_server: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 shadow-sm"
                            >
                                <Save className="size-4 mr-2" />
                                Simpan Semua Pengaturan
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
