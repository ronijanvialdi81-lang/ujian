<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyKelas;
use App\Models\CandyLog;
use App\Models\CandyNilaiTemp;
use App\Models\CandySiswa;
use App\Models\CandyUjian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class StatusPesertaController extends Controller
{
    /**
     * Display live exam student status / monitoring.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $kelasFilter = $request->query('kelas');
        $statusFilter = $request->query('status'); // online, selesai, berlangsung

        if (! Schema::hasTable('siswa')) {
            return Inertia::render('admin/status-peserta/index', [
                'peserta' => [],
                'kelasOptions' => [],
                'stats' => ['total' => 0, 'mengerjakan' => 0, 'selesai' => 0, 'belum' => 0],
                'filters' => ['search' => $search, 'kelas' => $kelasFilter, 'status' => $statusFilter],
            ]);
        }

        $kelasOptions = CandyKelas::orderBy('nama')->get();

        // Query active records from nilai_temp and join with siswa
        $query = CandyNilaiTemp::query()
            ->with(['siswa', 'ujian'])
            ->leftJoin('siswa', 'nilai_temp.id_siswa', '=', 'siswa.id_siswa')
            ->select('nilai_temp.*', 'siswa.nama as siswa_nama', 'siswa.nisn', 'siswa.id_kelas', 'siswa.sesi', 'siswa.ruang', 'siswa.foto');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('siswa.nama', 'like', "%{$search}%")
                    ->orWhere('siswa.nisn', 'like', "%{$search}%")
                    ->orWhere('siswa.no_peserta', 'like', "%{$search}%");
            });
        }

        if ($kelasFilter) {
            $query->where('siswa.id_kelas', $kelasFilter);
        }

        if ($statusFilter === 'selesai') {
            $query->whereNotNull('nilai_temp.ujian_selesai');
        } elseif ($statusFilter === 'mengerjakan') {
            $query->whereNull('nilai_temp.ujian_selesai');
        }

        $records = $query->orderByDesc('nilai_temp.ujian_mulai')->paginate(20)->withQueryString();

        // If no records in nilai_temp, also show recent login logs
        $recentLogs = [];
        if (Schema::hasTable('log')) {
            $recentLogs = CandyLog::with('siswa')
                ->where('type', 'login')
                ->orderByDesc('id_log')
                ->limit(20)
                ->get()
                ->map(function ($l) {
                    return [
                        'id_log' => $l->id_log,
                        'nama' => $l->siswa ? $l->siswa->nama : 'Siswa #' . $l->id_siswa,
                        'kelas' => $l->siswa ? $l->siswa->id_kelas : '-',
                        'text' => $l->text,
                        'date' => $l->date,
                    ];
                });
        }

        $stats = [
            'total' => CandySiswa::count(),
            'mengerjakan' => CandyNilaiTemp::whereNull('ujian_selesai')->count(),
            'selesai' => CandyNilaiTemp::whereNotNull('ujian_selesai')->count(),
            'online' => CandyNilaiTemp::where('online', 1)->count(),
        ];

        return Inertia::render('admin/status-peserta/index', [
            'peserta' => $records,
            'recentLogs' => $recentLogs,
            'kelasOptions' => $kelasOptions,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'kelas' => $kelasFilter,
                'status' => $statusFilter,
            ],
        ]);
    }

    /**
     * Reset student exam status / login.
     */
    public function reset(Request $request, $id): RedirectResponse
    {
        if (Schema::hasTable('nilai_temp')) {
            // reset online flag and ipaddress so student can reconnect
            CandyNilaiTemp::where('id_nilai', $id)->update([
                'online' => 0,
                'blok' => 0,
            ]);
        }

        return back()->with('success', 'Status login peserta berhasil di-reset.');
    }

    /**
     * Selesaikan ujian paksa.
     */
    public function finish(Request $request, $id): RedirectResponse
    {
        if (Schema::hasTable('nilai_temp')) {
            CandyNilaiTemp::where('id_nilai', $id)->update([
                'ujian_selesai' => date('Y-m-d H:i:s'),
                'online' => 0,
            ]);
        }

        return back()->with('success', 'Ujian peserta berhasil diselesaikan.');
    }
}
