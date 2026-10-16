<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyMapel;
use App\Models\CandyPengawas;
use App\Models\CandySoal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class BankSoalController extends Controller
{
    /**
     * Display a listing of question packages from Candy CBT.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        if (! Schema::hasTable('mapel')) {
            return Inertia::render('admin/bank-soal/index', [
                'bankSoals' => [],
                'mataPelajarans' => [],
                'gurus' => [],
                'filters' => ['search' => $search],
            ]);
        }

        $query = CandyMapel::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        $mapels = $query->orderBy('nama')->paginate(20)->withQueryString();

        // Get count of actual questions in soal table grouped by id_mapel
        $soalCounts = CandySoal::selectRaw('id_mapel, count(*) as total, sum(case when jenis = 1 then 1 else 0 end) as pg, sum(case when jenis = 2 then 1 else 0 end) as esai')
            ->groupBy('id_mapel')
            ->get()
            ->keyBy('id_mapel');

        $mapels->through(function ($m) use ($soalCounts) {
            $sc = $soalCounts->get($m->id_mapel);
            $actualTotal = $sc ? $sc->total : ($m->jml_soal + $m->jml_esai);

            return [
                'id' => $m->id_mapel,
                'kode' => $m->kode,
                'judul' => $m->nama,
                'mata_pelajaran_id' => $m->id_mapel,
                'mata_pelajaran' => [
                    'id' => $m->id_mapel,
                    'nama' => $m->nama,
                    'kode' => $m->kode,
                ],
                'guru_id' => $m->idguru,
                'guru' => [
                    'id' => $m->idguru,
                    'name' => 'Guru Pengampu',
                ],
                'tingkat' => $m->level ?: '10',
                'jumlah_pg' => $sc ? $sc->pg : $m->jml_soal,
                'jumlah_esai' => $sc ? $sc->esai : $m->jml_esai,
                'total_soal' => $actualTotal,
                'durasi_menit' => 90,
                'status' => $m->status == '1' || $m->status == 'aktif' ? 'aktif' : 'aktif',
                'kkm' => $m->kkm ?: 75,
                'kelas' => $m->kelas,
            ];
        });

        $gurus = CandyPengawas::orderBy('nama')->get()->map(function ($p) {
            return [
                'id' => $p->id_pengawas,
                'name' => $p->nama,
            ];
        });

        $mataPelajarans = Schema::hasTable('mata_pelajaran')
            ? \App\Models\CandyMataPelajaran::orderBy('nama_mapel')->get()->map(fn($m) => [
                'id' => $m->kode_mapel,
                'nama' => $m->nama_mapel,
                'kode' => $m->kode_mapel,
            ])
            : [];

        return Inertia::render('admin/bank-soal/index', [
            'bankSoals' => $mapels,
            'mataPelajarans' => $mataPelajarans,
            'gurus' => $gurus,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created question package.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50'],
            'judul' => ['required', 'string', 'max:255'],
            'tingkat' => ['required', 'string'],
            'jumlah_pg' => ['required', 'integer'],
            'jumlah_esai' => ['required', 'integer'],
        ]);

        CandyMapel::create([
            'kode' => $validated['kode'],
            'nama' => $validated['judul'],
            'level' => $validated['tingkat'],
            'jml_soal' => $validated['jumlah_pg'],
            'jml_esai' => $validated['jumlah_esai'],
            'tampil_pg' => $validated['jumlah_pg'],
            'tampil_esai' => $validated['jumlah_esai'],
            'bobot_pg' => 100,
            'bobot_esai' => 0,
            'opsi' => 5,
            'status' => '1',
            'kkm' => 75,
            'date' => now()->toDateString(),
        ]);

        return redirect()->back()->with('success', 'Paket Bank Soal berhasil ditambahkan.');
    }

    /**
     * Update the specified question package.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50'],
            'judul' => ['required', 'string', 'max:255'],
            'tingkat' => ['required', 'string'],
            'jumlah_pg' => ['required', 'integer'],
            'jumlah_esai' => ['required', 'integer'],
        ]);

        $mapel = CandyMapel::findOrFail($id);
        $mapel->update([
            'kode' => $validated['kode'],
            'nama' => $validated['judul'],
            'level' => $validated['tingkat'],
            'jml_soal' => $validated['jumlah_pg'],
            'jml_esai' => $validated['jumlah_esai'],
        ]);

        return redirect()->back()->with('success', 'Paket Bank Soal berhasil diperbarui.');
    }

    /**
     * Remove the specified question package.
     */
    public function destroy($id): RedirectResponse
    {
        CandyMapel::where('id_mapel', $id)->delete();

        return redirect()->back()->with('success', 'Paket Bank Soal berhasil dihapus.');
    }

    /**
     * Display questions for a specific question package.
     */
    public function soalIndex($id): Response|RedirectResponse
    {
        if (! Schema::hasTable('mapel') || ! Schema::hasTable('soal')) {
            return redirect()->route('admin.bank-soal');
        }

        $bankSoal = CandyMapel::findOrFail($id);
        $soals = CandySoal::where('id_mapel', $id)->orderBy('nomor')->paginate(20)->withQueryString();

        return Inertia::render('admin/bank-soal/soal', [
            'bankSoal' => [
                'id' => $bankSoal->id_mapel,
                'kode' => $bankSoal->kode,
                'nama' => $bankSoal->nama,
                'level' => $bankSoal->level,
                'jml_soal' => $bankSoal->jml_soal,
                'jml_esai' => $bankSoal->jml_esai,
            ],
            'soals' => $soals,
        ]);
    }

    /**
     * Store a newly created question in the package.
     */
    public function soalStore(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'nomor' => 'nullable|integer',
            'jenis' => 'required|in:1,2',
            'soal' => 'required|string',
            'pilA' => 'nullable|string',
            'pilB' => 'nullable|string',
            'pilC' => 'nullable|string',
            'pilD' => 'nullable|string',
            'pilE' => 'nullable|string',
            'jawaban' => 'nullable|string|max:1',
        ]);

        if (Schema::hasTable('soal')) {
            $nomor = $validated['nomor'] ?? (CandySoal::where('id_mapel', $id)->max('nomor') + 1);

            CandySoal::create([
                'id_mapel' => $id,
                'nomor' => $nomor ?: 1,
                'soal' => $validated['soal'],
                'jenis' => (int) $validated['jenis'],
                'pilA' => $validated['pilA'] ?? '',
                'pilB' => $validated['pilB'] ?? '',
                'pilC' => $validated['pilC'] ?? '',
                'pilD' => $validated['pilD'] ?? '',
                'pilE' => $validated['pilE'] ?? '',
                'jawaban' => strtoupper($validated['jawaban'] ?? 'A'),
            ]);

            // Update question counts in mapel table
            $countPg = CandySoal::where('id_mapel', $id)->where('jenis', 1)->count();
            $countEsai = CandySoal::where('id_mapel', $id)->where('jenis', 2)->count();
            CandyMapel::where('id_mapel', $id)->update([
                'jml_soal' => $countPg,
                'jml_esai' => $countEsai,
            ]);
        }

        return redirect()->back()->with('success', 'Butir soal berhasil ditambahkan.');
    }

    /**
     * Update an existing question.
     */
    public function soalUpdate(Request $request, $id, $soalId): RedirectResponse
    {
        $validated = $request->validate([
            'nomor' => 'required|integer',
            'jenis' => 'required|in:1,2',
            'soal' => 'required|string',
            'pilA' => 'nullable|string',
            'pilB' => 'nullable|string',
            'pilC' => 'nullable|string',
            'pilD' => 'nullable|string',
            'pilE' => 'nullable|string',
            'jawaban' => 'nullable|string|max:1',
        ]);

        if (Schema::hasTable('soal')) {
            CandySoal::where('id_soal', $soalId)->update([
                'nomor' => $validated['nomor'],
                'soal' => $validated['soal'],
                'jenis' => (int) $validated['jenis'],
                'pilA' => $validated['pilA'] ?? '',
                'pilB' => $validated['pilB'] ?? '',
                'pilC' => $validated['pilC'] ?? '',
                'pilD' => $validated['pilD'] ?? '',
                'pilE' => $validated['pilE'] ?? '',
                'jawaban' => strtoupper($validated['jawaban'] ?? 'A'),
            ]);
        }

        return redirect()->back()->with('success', 'Butir soal berhasil diperbarui.');
    }

    /**
     * Delete a question from the package.
     */
    public function soalDestroy($id, $soalId): RedirectResponse
    {
        if (Schema::hasTable('soal')) {
            CandySoal::where('id_soal', $soalId)->delete();

            // Re-sync counts
            $countPg = CandySoal::where('id_mapel', $id)->where('jenis', 1)->count();
            $countEsai = CandySoal::where('id_mapel', $id)->where('jenis', 2)->count();
            CandyMapel::where('id_mapel', $id)->update([
                'jml_soal' => $countPg,
                'jml_esai' => $countEsai,
            ]);
        }

        return redirect()->back()->with('success', 'Butir soal berhasil dihapus.');
    }
}
