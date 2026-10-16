<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyKelas;
use App\Models\CandySiswa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    /**
     * Display a listing of students from Candy CBT.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $kelasId = $request->query('kelas_id');

        if (! Schema::hasTable('siswa')) {
            $siswas = User::where('role', 'siswa')->paginate(20)->withQueryString();
            return Inertia::render('admin/siswa/index', [
                'siswas' => $siswas,
                'kelasList' => [],
                'totalCount' => $siswas->total(),
                'filters' => ['search' => $search, 'kelas_id' => $kelasId],
            ]);
        }

        $query = CandySiswa::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('no_peserta', 'like', "%{$search}%");
            });
        }

        if ($kelasId) {
            $query->where('id_kelas', $kelasId);
        }

        $siswas = $query->orderBy('nama')->paginate(20)->withQueryString();

        $siswas->through(function ($s) {
            return [
                'id' => $s->id_siswa,
                'name' => $s->nama,
                'username' => $s->username,
                'nis' => $s->nis,
                'no_peserta' => $s->no_peserta,
                'email' => $s->username . '@siswa.sch.id',
                'kelas_id' => $s->id_kelas,
                'kelas' => [
                    'id' => $s->id_kelas,
                    'nama' => $s->id_kelas,
                ],
                'level' => $s->level,
                'ruang' => $s->ruang,
                'sesi' => $s->sesi,
                'gender' => $s->jenis_kelamin ?: 'L',
                'phone' => $s->hp,
                'status' => 'aktif',
            ];
        });

        $kelasList = CandyKelas::orderBy('nama')->get()->map(function ($k) {
            return [
                'id' => $k->id_kelas,
                'nama' => $k->nama ?: $k->id_kelas,
                'tingkat' => $k->level,
            ];
        });

        return Inertia::render('admin/siswa/index', [
            'siswas' => $siswas,
            'kelasList' => $kelasList,
            'totalCount' => $totalCount,
            'filters' => [
                'search' => $search,
                'kelas_id' => $kelasId,
            ],
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50'],
            'kelas_id' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
        ]);

        CandySiswa::create([
            'nama' => $validated['name'],
            'username' => $validated['username'],
            'nis' => $request->input('nis') ?: $validated['username'],
            'no_peserta' => $request->input('no_peserta') ?: $validated['username'],
            'id_kelas' => $validated['kelas_id'] ?? 'UMUM',
            'jenis_kelamin' => $validated['gender'] ?? 'L',
            'hp' => $validated['phone'] ?? '',
            'password' => '123456',
            'sesi' => '1',
            'ruang' => 'LAB 1',
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Update the specified student.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50'],
            'kelas_id' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
        ]);

        $siswa = CandySiswa::findOrFail($id);
        $siswa->update([
            'nama' => $validated['name'],
            'username' => $validated['username'],
            'id_kelas' => $validated['kelas_id'] ?? $siswa->id_kelas,
            'jenis_kelamin' => $validated['gender'] ?? 'L',
            'hp' => $validated['phone'] ?? $siswa->hp,
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified student.
     */
    public function destroy($id): RedirectResponse
    {
        CandySiswa::where('id_siswa', $id)->delete();

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus.');
    }
}
