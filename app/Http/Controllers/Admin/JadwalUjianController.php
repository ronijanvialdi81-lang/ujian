<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyKelas;
use App\Models\CandyMapel;
use App\Models\CandyUjian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class JadwalUjianController extends Controller
{
    /**
     * Display a listing of exam schedules from Candy CBT.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        if (! Schema::hasTable('ujian')) {
            return Inertia::render('admin/jadwal-ujian/index', [
                'jadwalUjians' => [],
                'bankSoals' => [],
                'kelasList' => [],
                'filters' => ['search' => $search],
            ]);
        }

        $query = CandyUjian::with('mapel');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_ujian', 'like', "%{$search}%")
                    ->orWhere('token', 'like', "%{$search}%");
            });
        }

        $ujians = $query->orderByDesc('tgl_ujian')->paginate(20)->withQueryString();

        $ujians->through(function ($u) {
            return [
                'id' => $u->id_ujian,
                'nama_ujian' => $u->nama ?: ($u->mapel ? $u->mapel->nama : 'Ujian CBT'),
                'bank_soal_id' => $u->id_mapel,
                'bank_soal' => [
                    'id' => $u->id_mapel,
                    'judul' => $u->mapel ? $u->mapel->nama : 'Bank Soal #' . $u->id_mapel,
                    'mata_pelajaran' => [
                        'nama' => $u->mapel ? $u->mapel->nama : '-',
                    ],
                ],
                'kelas_id' => $u->kelas,
                'kelas' => [
                    'nama' => $u->kelas ?: 'Semua Kelas',
                ],
                'tanggal_mulai' => $u->tgl_ujian . ' ' . ($u->waktu_ujian ?: '07:30:00'),
                'tanggal_selesai' => $u->tgl_selesai . ' ' . ($u->selesai_ujian ?: '12:00:00'),
                'durasi_menit' => (int) ($u->lama_ujian ?: 90),
                'token' => $u->token ?: 'CBTTOK',
                'status' => $u->status == '1' ? 'berlangsung' : 'selesai',
            ];
        });

        $bankSoals = CandyMapel::orderBy('nama')->get()->map(function ($m) {
            return [
                'id' => $m->id_mapel,
                'judul' => $m->nama,
                'durasi_menit' => 90,
                'mata_pelajaran' => [
                    'nama' => $m->nama,
                ],
            ];
        });

        $kelasList = CandyKelas::orderBy('nama')->get()->map(function ($k) {
            return [
                'id' => $k->id_kelas,
                'nama' => $k->nama ?: $k->id_kelas,
            ];
        });

        return Inertia::render('admin/jadwal-ujian/index', [
            'jadwalUjians' => $ujians,
            'bankSoals' => $bankSoals,
            'kelasList' => $kelasList,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created exam schedule.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_ujian' => ['required', 'string', 'max:255'],
            'bank_soal_id' => ['required'],
            'durasi_menit' => ['required', 'integer'],
            'token' => ['nullable', 'string'],
        ]);

        $token = !empty($validated['token']) ? strtoupper($validated['token']) : strtoupper(Str::random(6));

        CandyUjian::create([
            'nama' => $validated['nama_ujian'],
            'kode_ujian' => 'UJN-' . strtoupper(Str::random(4)),
            'id_mapel' => $validated['bank_soal_id'],
            'lama_ujian' => $validated['durasi_menit'],
            'tgl_ujian' => now()->toDateString(),
            'tgl_selesai' => now()->addDays(1)->toDateString(),
            'waktu_ujian' => '07:30:00',
            'selesai_ujian' => '17:00:00',
            'token' => $token,
            'status' => '1',
            'acak' => '1',
            'kkm' => '75',
            'kelas' => $request->input('kelas_id') ?: 'SEMUA',
        ]);

        return redirect()->back()->with('success', 'Jadwal ujian berhasil ditambahkan dengan Token: ' . $token);
    }

    /**
     * Update the specified exam schedule.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'nama_ujian' => ['required', 'string', 'max:255'],
            'durasi_menit' => ['required', 'integer'],
            'token' => ['required', 'string'],
        ]);

        $ujian = CandyUjian::findOrFail($id);
        $ujian->update([
            'nama' => $validated['nama_ujian'],
            'lama_ujian' => $validated['durasi_menit'],
            'token' => strtoupper($validated['token']),
        ]);

        return redirect()->back()->with('success', 'Jadwal ujian berhasil diperbarui.');
    }

    /**
     * Remove the specified exam schedule.
     */
    public function destroy($id): RedirectResponse
    {
        CandyUjian::where('id_ujian', $id)->delete();

        return redirect()->back()->with('success', 'Jadwal ujian berhasil dihapus.');
    }
}
