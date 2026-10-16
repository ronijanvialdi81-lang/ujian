<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyPengawas;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class GuruController extends Controller
{
    /**
     * Display a listing of teachers / proctors from Candy CBT.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        if (! Schema::hasTable('pengawas')) {
            $gurus = User::where('role', 'guru')->paginate(20)->withQueryString();
            return Inertia::render('admin/guru/index', [
                'gurus' => $gurus,
                'mataPelajarans' => [],
                'filters' => ['search' => $search],
            ]);
        }

        $query = CandyPengawas::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $pengawas = $query->orderBy('nama')->paginate(20)->withQueryString();

        $pengawas->through(function ($p) {
            return [
                'id' => $p->id_pengawas,
                'name' => $p->nama,
                'username' => $p->username,
                'email' => $p->email ?: $p->username . '@sekolah.sch.id',
                'nip' => $p->nip,
                'jabatan' => $p->jabatan,
                'level' => $p->level,
                'phone' => $p->no_hp,
                'gender' => $p->jenis_kelamin ?: 'L',
                'status' => $p->status_aktif == '1' || $p->status_aktif == 'aktif' ? 'aktif' : 'aktif',
                'ruang' => $p->ruang,
            ];
        });

        return Inertia::render('admin/guru/index', [
            'gurus' => $pengawas,
            'mataPelajarans' => [],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created teacher.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
        ]);

        CandyPengawas::create([
            'nama' => $validated['name'],
            'username' => $validated['username'],
            'nip' => $request->input('nip') ?: '-',
            'email' => $validated['email'] ?? '',
            'no_hp' => $validated['phone'] ?? '',
            'jenis_kelamin' => $validated['gender'] ?? 'L',
            'level' => 'guru',
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'status_aktif' => '1',
        ]);

        return redirect()->back()->with('success', 'Data guru berhasil ditambahkan ke database.');
    }

    /**
     * Update the specified teacher.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
        ]);

        $guru = CandyPengawas::findOrFail($id);
        $guru->update([
            'nama' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'] ?? '',
            'no_hp' => $validated['phone'] ?? '',
            'jenis_kelamin' => $validated['gender'] ?? 'L',
        ]);

        return redirect()->back()->with('success', 'Data guru berhasil diperbarui.');
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy($id): RedirectResponse
    {
        CandyPengawas::where('id_pengawas', $id)->delete();

        return redirect()->back()->with('success', 'Data guru berhasil dihapus.');
    }
}
