<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyMapel;
use App\Models\CandyNilai;
use App\Models\CandySiswa;
use App\Models\CandyUjian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class RekapNilaiController extends Controller
{
    /**
     * Display a listing of exam results from Candy CBT nilai table.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $jadwalId = $request->query('jadwal_id');

        if (! Schema::hasTable('nilai')) {
            return Inertia::render('admin/rekap-nilai/index', [
                'rekapNilais' => [],
                'stats' => ['total_ujian' => 0, 'rata_rata' => 0, 'total_tuntas' => 0, 'total_remedial' => 0],
                'jadwalList' => [],
                'filters' => ['search' => $search, 'jadwal_id' => $jadwalId],
            ]);
        }

        $query = CandyNilai::with(['siswa', 'mapel', 'ujian']);

        if ($jadwalId) {
            $query->where('id_mapel', $jadwalId);
        }

        if ($search) {
            $query->whereHas('siswa', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $totalNilai = CandyNilai::count();
        $nilais = $query->orderByDesc('id_nilai')->paginate(20)->withQueryString();

        $nilais->through(function ($n) {
            $nilaiFloat = (float) ($n->total ?: $n->skor ?: 0);
            $isTuntas = $nilaiFloat >= 75;

            return [
                'id' => $n->id_nilai,
                'jadwal_ujian_id' => $n->id_ujian,
                'jadwal_ujian' => [
                    'nama_ujian' => ($n->kode_ujian ?: 'Ujian CBT') . ' - ' . ($n->mapel ? $n->mapel->nama : 'Mapel #' . $n->id_mapel),
                    'bank_soal' => [
                        'mata_pelajaran' => [
                            'nama' => $n->mapel ? $n->mapel->nama : 'Mapel #' . $n->id_mapel,
                        ],
                    ],
                ],
                'siswa_id' => $n->id_siswa,
                'siswa' => [
                    'name' => $n->siswa ? $n->siswa->nama : 'Siswa #' . $n->id_siswa,
                    'username' => $n->siswa ? $n->siswa->nis : '-',
                    'kelas' => [
                        'nama' => $n->siswa ? $n->siswa->id_kelas : '-',
                    ],
                ],
                'jumlah_benar' => (int) $n->jml_benar,
                'jumlah_salah' => (int) $n->jml_salah,
                'nilai_akhir' => $nilaiFloat,
                'status' => $isTuntas ? 'tuntas' : 'remedial',
                'waktu_selesai' => $n->ujian_selesai,
            ];
        });

        $avgScore = $totalNilai > 0 ? round(CandyNilai::avg('total'), 1) : 0;
        $totalTuntas = CandyNilai::where('total', '>=', 75)->count();
        $totalRemedial = $totalNilai - $totalTuntas;

        $stats = [
            'total_ujian' => $totalNilai,
            'rata_rata' => $avgScore,
            'total_tuntas' => $totalTuntas,
            'total_remedial' => $totalRemedial,
        ];

        $jadwalList = CandyMapel::orderBy('nama')->get()->map(function ($m) {
            return [
                'id' => $m->id_mapel,
                'nama_ujian' => $m->nama . ' (' . $m->kode . ')',
            ];
        });

        return Inertia::render('admin/rekap-nilai/index', [
            'rekapNilais' => $nilais,
            'stats' => $stats,
            'jadwalList' => $jadwalList,
            'filters' => [
                'search' => $search,
                'jadwal_id' => $jadwalId,
            ],
        ]);
    }
}
