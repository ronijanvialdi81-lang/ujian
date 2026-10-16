import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    FileCheck,
    FileSpreadsheet,
    FileText,
    IdCard,
    Printer,
    School,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Cetak Dokumen', href: '/admin/cetak' },
];

interface CetakProps {
    type: string; // kartu, absen, berita-acara
    setting: any;
    kelasOptions: any[];
    sesiOptions: any[];
    ruangOptions: any[];
    ujianOptions: any[];
    siswa: any[];
    filters: {
        kelas?: string;
        sesi?: string;
        ruang?: string;
    };
}

export default function CetakIndex({
    type = 'kartu',
    setting,
    kelasOptions = [],
    sesiOptions = [],
    ruangOptions = [],
    ujianOptions = [],
    siswa = [],
    filters = {},
}: CetakProps) {
    const [selectedType, setSelectedType] = useState(type);
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || '');
    const [selectedSesi, setSelectedSesi] = useState(filters.sesi || '');
    const [selectedRuang, setSelectedRuang] = useState(filters.ruang || '');

    const handleTypeChange = (newType: string) => {
        setSelectedType(newType);
        router.get('/admin/cetak', {
            type: newType,
            kelas: selectedKelas,
            sesi: selectedSesi,
            ruang: selectedRuang,
        }, { preserveState: false });
    };

    const handleFilterChange = (key: string, val: string) => {
        const nextFilters = {
            type: selectedType,
            kelas: key === 'kelas' ? val : selectedKelas,
            sesi: key === 'sesi' ? val : selectedSesi,
            ruang: key === 'ruang' ? val : selectedRuang,
        };
        if (key === 'kelas') setSelectedKelas(val);
        if (key === 'sesi') setSelectedSesi(val);
        if (key === 'ruang') setSelectedRuang(val);

        router.get('/admin/cetak', nextFilters, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cetak Dokumen Ujian - CBT Ujian Sekolah" />

            <div className="flex flex-col gap-6 p-4 md:p-6 print:p-0">
                {/* Header (Hidden on Print) */}
                <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-blue-100 mb-2">
                            <Printer className="size-3.5 text-blue-200" />
                            Format Siap Cetak
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Cetak Administrasi Ujian</h1>
                        <p className="text-blue-100 text-sm mt-1">
                            Cetak Kartu Peserta Ujian, Daftar Hadir Siswa, dan Berita Acara Ujian Sekolah.
                        </p>
                    </div>

                    <Button
                        onClick={handlePrint}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md w-fit"
                    >
                        <Printer className="size-4 mr-2" />
                        Cetak Sekarang
                    </Button>
                </div>

                {/* Submenu Type Selector (Hidden on Print) */}
                <div className="print:hidden flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                    <button
                        onClick={() => handleTypeChange('kartu')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            selectedType === 'kartu'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <IdCard className="size-4" />
                        <span>Cetak Kartu Peserta</span>
                    </button>

                    <button
                        onClick={() => handleTypeChange('absen')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            selectedType === 'absen'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <FileSpreadsheet className="size-4" />
                        <span>Cetak Daftar Hadir</span>
                    </button>

                    <button
                        onClick={() => handleTypeChange('berita-acara')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            selectedType === 'berita-acara'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <FileCheck className="size-4" />
                        <span>Cetak Berita Acara</span>
                    </button>
                </div>

                {/* Filters Bar (Hidden on Print) */}
                <div className="print:hidden flex flex-wrap items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
                    <span className="text-xs font-semibold text-gray-500 mr-2">Filter Data:</span>

                    <select
                        value={selectedKelas}
                        onChange={(e) => handleFilterChange('kelas', e.target.value)}
                        className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200"
                    >
                        <option value="">Semua Kelas</option>
                        {kelasOptions.map((k) => (
                            <option key={k.id_kelas} value={k.id_kelas}>
                                {k.nama}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedSesi}
                        onChange={(e) => handleFilterChange('sesi', e.target.value)}
                        className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200"
                    >
                        <option value="">Semua Sesi</option>
                        {sesiOptions.map((s) => (
                            <option key={s.kode_sesi} value={s.kode_sesi}>
                                Sesi {s.nama_sesi || s.kode_sesi}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedRuang}
                        onChange={(e) => handleFilterChange('ruang', e.target.value)}
                        className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200"
                    >
                        <option value="">Semua Ruang</option>
                        {ruangOptions.map((r) => (
                            <option key={r.kode_ruang} value={r.kode_ruang}>
                                Ruang {r.kode_ruang}
                            </option>
                        ))}
                    </select>

                    <div className="ml-auto text-xs text-gray-500">
                        Ditemukan: <strong>{siswa.length}</strong> siswa
                    </div>
                </div>

                {/* 1. CETAK KARTU PESERTA */}
                {selectedType === 'kartu' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
                        {siswa.length === 0 ? (
                            <div className="col-span-2 text-center py-12 text-gray-400 bg-white dark:bg-gray-900 rounded-xl">
                                Tidak ada siswa yang sesuai kriteria filter.
                            </div>
                        ) : (
                            siswa.map((s) => (
                                <div
                                    key={s.id_siswa}
                                    className="border-2 border-gray-800 rounded-lg p-3 bg-white text-gray-900 shadow-xs print:break-inside-avoid text-xs"
                                >
                                    {/* Header Kop */}
                                    <div className="border-b-2 border-gray-800 pb-2 mb-2 flex items-center gap-3">
                                        <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shrink-0">
                                            {setting?.sekolah ? setting.sekolah.charAt(0) : 'S'}
                                        </div>
                                        <div className="text-center flex-1 leading-tight">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                                                {setting?.header_kartu || 'KARTU PESERTA UJIAN SEKOLAH'}
                                            </div>
                                            <div className="font-extrabold text-sm uppercase">
                                                {setting?.sekolah || 'SMK NEGERI 1 BATUSANGKAR'}
                                            </div>
                                            <div className="text-[9px] text-gray-600">
                                                NPSN: {setting?.npsn || '69787351'} | {setting?.alamat || 'Jl. Pintu Rayo'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="grid grid-cols-4 gap-2 items-center">
                                        <div className="col-span-1 flex flex-col items-center justify-center border border-gray-300 rounded p-1 bg-gray-50 h-24">
                                            <div className="text-[10px] text-gray-400 font-medium">Foto 2x3</div>
                                            <div className="text-xs font-bold text-gray-600 mt-1">
                                                {s.jenis_kelamin || 'L'}
                                            </div>
                                        </div>

                                        <div className="col-span-3 space-y-1">
                                            <div className="grid grid-cols-3">
                                                <span className="text-gray-500">No. Peserta</span>
                                                <span className="col-span-2 font-mono font-bold">: {s.no_peserta || s.username}</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <span className="text-gray-500">Nama Lengkap</span>
                                                <span className="col-span-2 font-bold uppercase truncate">: {s.nama}</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <span className="text-gray-500">NISN / Kelas</span>
                                                <span className="col-span-2">: {s.nisn} / {s.id_kelas}</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <span className="text-gray-500">Sesi / Ruang</span>
                                                <span className="col-span-2 font-semibold text-purple-700">: Sesi {s.sesi || '1'} / Ruang {s.ruang || '1'}</span>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <span className="text-gray-500">Password</span>
                                                <span className="col-span-2 font-mono">: {s.password || '******'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer TTD */}
                                    <div className="border-t border-gray-200 mt-2 pt-1 flex justify-between items-end text-[9px] text-gray-600">
                                        <span>Dicetak melalui Sistem CBT</span>
                                        <div className="text-right">
                                            <div>Kepala Sekolah,</div>
                                            <div className="font-bold underline mt-4">{setting?.kepsek || 'SYOFRIANI, M.Pd.E'}</div>
                                            <div>NIP. {setting?.nip || '197801102005012008'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 2. CETAK DAFTAR HADIR */}
                {selectedType === 'absen' && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-gray-900 shadow-sm print:border-none print:shadow-none text-xs">
                        {/* Kop */}
                        <div className="text-center border-b-2 border-black pb-3 mb-4">
                            <h2 className="text-base font-bold uppercase tracking-wide">
                                DAFTAR HADIR PESERTA UJIAN SEKOLAH
                            </h2>
                            <h3 className="text-sm font-extrabold uppercase">
                                {setting?.sekolah || 'SMK NEGERI 1 BATUSANGKAR'}
                            </h3>
                            <p className="text-[11px] text-gray-600">
                                Tahun Pelajaran 2026/2027 | {setting?.alamat || 'Jl. Pintu Rayo Saruaso'}
                            </p>
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                            <div>
                                <div>Kelas : <strong>{selectedKelas || 'Semua Kelas'}</strong></div>
                                <div>Sesi : <strong>{selectedSesi || 'Semua Sesi'}</strong></div>
                            </div>
                            <div className="text-right">
                                <div>Ruang : <strong>{selectedRuang || 'Semua Ruang'}</strong></div>
                                <div>Tanggal : <strong>{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</strong></div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full border-collapse border border-black text-left mb-6">
                            <thead>
                                <tr className="bg-gray-100 border-b border-black">
                                    <th className="border border-black p-2 w-10 text-center">No</th>
                                    <th className="border border-black p-2 w-32">No. Peserta</th>
                                    <th className="border border-black p-2">Nama Siswa</th>
                                    <th className="border border-black p-2 w-20 text-center">Kelas</th>
                                    <th className="border border-black p-2 w-32 text-center" colSpan={2}>Tanda Tangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswa.map((s, idx) => (
                                    <tr key={s.id_siswa} className="border-b border-black">
                                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                                        <td className="border border-black p-2 font-mono">{s.no_peserta || s.username}</td>
                                        <td className="border border-black p-2 font-semibold uppercase">{s.nama}</td>
                                        <td className="border border-black p-2 text-center">{s.id_kelas}</td>
                                        <td className="border border-black p-2 w-16 text-left text-gray-400">
                                            {idx % 2 === 0 ? `${idx + 1}. .........` : ''}
                                        </td>
                                        <td className="border border-black p-2 w-16 text-left text-gray-400">
                                            {idx % 2 !== 0 ? `${idx + 1}. .........` : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* TTD Pengawas */}
                        <div className="grid grid-cols-2 text-center text-xs mt-8">
                            <div>
                                <div>Mengetahui,</div>
                                <div>Kepala Sekolah</div>
                                <div className="mt-14 font-bold underline">{setting?.kepsek || 'SYOFRIANI, M.Pd.E'}</div>
                                <div>NIP. {setting?.nip || '197801102005012008'}</div>
                            </div>
                            <div>
                                <div>Pengawas Ruang,</div>
                                <div className="text-gray-400 text-[10px]">(Nama Terang & Tanda Tangan)</div>
                                <div className="mt-14 font-bold underline">................................................</div>
                                <div>NIP. ........................................</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. CETAK BERITA ACARA */}
                {selectedType === 'berita-acara' && (
                    <div className="bg-white p-8 rounded-xl border border-gray-200 text-gray-900 shadow-sm print:border-none print:shadow-none text-xs leading-relaxed max-w-4xl mx-auto">
                        <div className="text-center border-b-2 border-black pb-3 mb-6">
                            <h2 className="text-base font-bold uppercase tracking-wide">
                                BERITA ACARA PELAKSANAAN UJIAN SEKOLAH BERBASIS KOMPUTER
                            </h2>
                            <h3 className="text-sm font-extrabold uppercase">
                                {setting?.sekolah || 'SMK NEGERI 1 BATUSANGKAR'}
                            </h3>
                            <p className="text-[11px] text-gray-600">
                                Tahun Pelajaran 2026/2027
                            </p>
                        </div>

                        <p className="mb-4 text-justify">
                            Pada hari ini <strong>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>, telah diselenggarakan Ujian Berbasis Komputer (CBT) untuk:
                        </p>

                        <div className="space-y-1.5 ml-4 mb-6">
                            <div className="grid grid-cols-4">
                                <span>Sekolah</span>
                                <span className="col-span-3 font-semibold">: {setting?.sekolah || 'SMK NEGERI 1 BATUSANGKAR'}</span>
                            </div>
                            <div className="grid grid-cols-4">
                                <span>Ruang Ujian</span>
                                <span className="col-span-3 font-semibold">: {selectedRuang || 'Ruang Laboratorium 1'}</span>
                            </div>
                            <div className="grid grid-cols-4">
                                <span>Sesi Ujian</span>
                                <span className="col-span-3 font-semibold">: Sesi {selectedSesi || '1'}</span>
                            </div>
                            <div className="grid grid-cols-4">
                                <span>Jumlah Peserta Terdaftar</span>
                                <span className="col-span-3">: {siswa.length} Orang</span>
                            </div>
                            <div className="grid grid-cols-4">
                                <span>Jumlah Peserta Hadir</span>
                                <span className="col-span-3">: .......... Orang</span>
                            </div>
                            <div className="grid grid-cols-4">
                                <span>Jumlah Peserta Tidak Hadir</span>
                                <span className="col-span-3">: .......... Orang</span>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50 text-[11px]">
                            <strong>Catatan Selama Ujian:</strong>
                            <p className="text-gray-500 italic mt-1">
                                Pelaksanaan ujian berlangsung dengan tertib, lancar, dan mematuhi seluruh tata tertib yang berlaku.
                            </p>
                        </div>

                        {/* TTD */}
                        <div className="grid grid-cols-2 text-center text-xs mt-12">
                            <div>
                                <div>Proktor / Teknisi Server,</div>
                                <div className="mt-16 font-bold underline">............................................</div>
                                <div>NIP. ........................................</div>
                            </div>
                            <div>
                                <div>Pengawas Ruang,</div>
                                <div className="mt-16 font-bold underline">............................................</div>
                                <div>NIP. ........................................</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
