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

class PengawasController extends Controller
{
    /**
     * Display Administrators & Proctors.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        if (! Schema::hasTable('pengawas')) {
            $users = User::whereIn('role', ['admin'])->paginate(20)->withQueryString();
            return Inertia::render('admin/pengawas/index', [
                'administrators' => $users,
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

        $administrators = $query->orderBy('nama')->paginate(20)->withQueryString();

        return Inertia::render('admin/pengawas/index', [
            'administrators' => $administrators,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store new Administrator / Proctor.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:30',
            'nama' => 'required|string|max:50',
            'username' => 'required|string|max:50',
            'password' => 'required|string|min:4',
            'jabatan' => 'nullable|string|max:50',
            'level' => 'nullable|string|max:20',
        ]);

        if (Schema::hasTable('pengawas')) {
            CandyPengawas::create([
                'nip' => $validated['nip'] ?? '',
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => $validated['password'],
                'jabatan' => $validated['jabatan'] ?? 'Proktor',
                'level' => $validated['level'] ?? 'admin',
            ]);
        }

        return back()->with('success', 'Data administrator / proktor berhasil ditambahkan.');
    }

    /**
     * Update Administrator / Proctor.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:30',
            'nama' => 'required|string|max:50',
            'username' => 'required|string|max:50',
            'password' => 'nullable|string|min:4',
            'jabatan' => 'nullable|string|max:50',
            'level' => 'nullable|string|max:20',
        ]);

        if (Schema::hasTable('pengawas')) {
            $data = [
                'nip' => $validated['nip'] ?? '',
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'jabatan' => $validated['jabatan'] ?? 'Proktor Utama',
                'level' => $validated['level'] ?? 'admin',
            ];

            if (!empty($validated['password'])) {
                $data['password'] = $validated['password'];
            }

            CandyPengawas::where('id_pengawas', $id)->update($data);
        }

        return back()->with('success', 'Data administrator / proktor berhasil diperbarui.');
    }

    /**
     * Delete Administrator / Proctor.
     */
    public function destroy($id): RedirectResponse
    {
        if (Schema::hasTable('pengawas')) {
            CandyPengawas::where('id_pengawas', $id)->delete();
        }

        return back()->with('success', 'Data administrator berhasil dihapus.');
    }
}
