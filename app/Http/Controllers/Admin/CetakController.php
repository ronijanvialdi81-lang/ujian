<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyKelas;
use App\Models\CandyRuang;
use App\Models\CandySesi;
use App\Models\CandySetting;
use App\Models\CandySiswa;
use App\Models\CandyUjian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class CetakController extends Controller
{
    /**
     * Display printing interface (Kartu Peserta, Daftar Hadir, Berita Acara).
     */
    public function index(Request $request): Response
    {
        $type = $request->query('type', 'kartu'); // kartu, absen, berita-acara
        $kelasFilter = $request->query('kelas', '');
        $sesiFilter = $request->query('sesi', '');
        $ruangFilter = $request->query('ruang', '');

        $setting = null;
        if (Schema::hasTable('setting')) {
            $setting = CandySetting::first();
        }

        $kelasOptions = Schema::hasTable('kelas') ? CandyKelas::orderBy('nama')->get() : [];
        $sesiOptions = Schema::hasTable('sesi') ? CandySesi::orderBy('kode_sesi')->get() : [];
        $ruangOptions = Schema::hasTable('ruang') ? CandyRuang::orderBy('kode_ruang')->get() : [];
        $ujianOptions = Schema::hasTable('ujian') ? CandyUjian::orderBy('id_ujian')->get() : [];

        $siswa = [];
        if (Schema::hasTable('siswa')) {
            $query = CandySiswa::query();
            if ($kelasFilter) {
                $query->where('id_kelas', $kelasFilter);
            }
            if ($sesiFilter) {
                $query->where('sesi', $sesiFilter);
            }
            if ($ruangFilter) {
                $query->where('ruang', $ruangFilter);
            }
            $siswa = $query->orderBy('nama')->limit(100)->get();
        }

        return Inertia::render('admin/cetak/index', [
            'type' => $type,
            'setting' => $setting,
            'kelasOptions' => $kelasOptions,
            'sesiOptions' => $sesiOptions,
            'ruangOptions' => $ruangOptions,
            'ujianOptions' => $ujianOptions,
            'siswa' => $siswa,
            'filters' => [
                'kelas' => $kelasFilter,
                'sesi' => $sesiFilter,
                'ruang' => $ruangFilter,
            ],
        ]);
    }
}
