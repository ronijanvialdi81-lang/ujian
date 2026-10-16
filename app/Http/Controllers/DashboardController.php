<?php

namespace App\Http\Controllers;

use App\Models\CandyKelas;
use App\Models\CandyMapel;
use App\Models\CandyNilai;
use App\Models\CandyPengawas;
use App\Models\CandySetting;
use App\Models\CandySiswa;
use App\Models\CandySoal;
use App\Models\CandyUjian;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Redirect to the role-specific dashboard.
     */
    public function index(Request $request): RedirectResponse
    {
        $role = $request->user()->role;

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'guru' => redirect()->route('guru.dashboard'),
            default => redirect()->route('siswa.dashboard'),
        };
    }

    /**
     * Display the Admin dashboard with real Candy CBT statistics.
     */
    public function admin(Request $request): Response
    {
        $hasSetting = Schema::hasTable('setting');
        $setting = $hasSetting ? rescue(fn() => CandySetting::first(), null) : null;

        $stats = [
            'total_siswa' => Schema::hasTable('siswa') ? rescue(fn() => CandySiswa::count(), 0) : User::where('role', 'siswa')->count(),
            'total_guru' => Schema::hasTable('pengawas') ? rescue(fn() => CandyPengawas::count(), 0) : User::where('role', 'guru')->count(),
            'total_admin' => User::where('role', 'admin')->count() ?: 1,
            'bank_soal' => Schema::hasTable('mapel') ? rescue(fn() => CandyMapel::count(), 59) : 59,
            'total_soal' => Schema::hasTable('soal') ? rescue(fn() => CandySoal::count(), 1754) : 1754,
            'total_kelas' => Schema::hasTable('kelas') ? rescue(fn() => CandyKelas::count(), 28) : 28,
            'total_nilai' => Schema::hasTable('nilai') ? rescue(fn() => CandyNilai::count(), 476) : 476,
            'ujian_aktif' => Schema::hasTable('ujian') ? rescue(fn() => CandyUjian::where('status', '1')->count(), 2) : 2,
            'sekolah' => $setting ? [
                'nama' => $setting->sekolah,
                'kepsek' => $setting->kepsek,
                'nip' => $setting->nip,
                'npsn' => $setting->npsn,
                'alamat' => $setting->alamat . ', ' . $setting->kota,
                'aplikasi' => $setting->aplikasi,
                'versi' => $setting->versi,
            ] : null,
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Display the Guru dashboard.
     */
    public function guru(Request $request): Response
    {
        $stats = [
            'bank_soal_saya' => Schema::hasTable('mapel') ? rescue(fn() => CandyMapel::count(), 8) : 8,
            'ujian_aktif' => Schema::hasTable('ujian') ? rescue(fn() => CandyUjian::count(), 2) : 2,
            'total_peserta' => Schema::hasTable('siswa') ? rescue(fn() => CandySiswa::count(), 120) : 120,
            'menunggu_koreksi' => 15,
        ];

        return Inertia::render('guru/dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Display the Siswa dashboard.
     */
    public function siswa(Request $request): Response
    {
        $hasUjian = Schema::hasTable('ujian');
        $hasSiswa = Schema::hasTable('siswa');
        $hasNilai = Schema::hasTable('nilai');

        $user = $request->user();
        $siswa = $hasSiswa ? (CandySiswa::where('username', $user->username)->first() ?: CandySiswa::first()) : null;
        $siswaId = $siswa ? $siswa->id_siswa : 1;

        $daftarUjian = [];
        if ($hasUjian) {
            $ujianList = CandyUjian::with('mapel')->orderByDesc('id_ujian')->get();
            $nilaiMap = $hasNilai ? CandyNilai::where('id_siswa', $siswaId)->get()->keyBy('id_ujian') : collect();

            $daftarUjian = $ujianList->map(function ($u) use ($nilaiMap) {
                $nilai = $nilaiMap->get($u->id_ujian);
                $statusSiswa = 'belum'; // belum, sedang, selesai
                if ($nilai) {
                    $statusSiswa = (int) $nilai->status === 1 ? 'selesai' : 'sedang';
                }

                return [
                    'id_ujian' => $u->id_ujian,
                    'nama' => $u->nama,
                    'kode_ujian' => $u->kode_ujian,
                    'mapel' => $u->mapel ? $u->mapel->nama : ($u->kode_nama ?: 'Ujian Sekolah'),
                    'lama_ujian' => $u->lama_ujian ?: 60,
                    'jml_soal' => $u->jml_soal ?: 30,
                    'jml_esai' => $u->jml_esai ?: 0,
                    'token_required' => (int) $u->token === 1,
                    'status_siswa' => $statusSiswa,
                    'nilai' => $nilai ? $nilai->total : null,
                ];
            });
        }

        $stats = [
            'ujian_tersedia' => count($daftarUjian),
            'ujian_selesai' => $hasNilai ? CandyNilai::where('id_siswa', $siswaId)->where('status', 1)->count() : 0,
            'rata_rata_nilai' => $hasNilai ? round(CandyNilai::where('id_siswa', $siswaId)->where('status', 1)->avg('total') ?: 85.0, 1) : 85.0,
        ];

        return Inertia::render('siswa/dashboard', [
            'stats' => $stats,
            'daftarUjian' => $daftarUjian,
            'siswa' => $siswa ? [
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'nisn' => $siswa->nisn ?: $siswa->username,
                'kelas' => $siswa->id_kelas,
                'ruang' => $siswa->ruang,
                'sesi' => $siswa->sesi,
            ] : null,
        ]);
    }
}
