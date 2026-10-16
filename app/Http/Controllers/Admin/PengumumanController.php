<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyPengumuman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PengumumanController extends Controller
{
    /**
     * Display CBT announcements.
     */
    public function index(): Response
    {
        $pengumuman = [];
        if (Schema::hasTable('pengumuman')) {
            $pengumuman = CandyPengumuman::orderByDesc('id_pengumuman')->paginate(20)->withQueryString();
        }

        return Inertia::render('admin/pengumuman/index', [
            'pengumuman' => $pengumuman,
        ]);
    }

    /**
     * Store new announcement.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:100',
            'text' => 'required|string',
            'type' => 'nullable|string|max:20',
        ]);

        if (Schema::hasTable('pengumuman')) {
            CandyPengumuman::create([
                'judul' => $validated['judul'],
                'text' => $validated['text'],
                'type' => $validated['type'] ?? 'eksternal',
                'user' => auth()->id() ?? 1,
                'date' => date('Y-m-d H:i:s'),
            ]);
        }

        return back()->with('success', 'Pengumuman berhasil diterbitkan.');
    }

    /**
     * Update announcement.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:100',
            'text' => 'required|string',
            'type' => 'nullable|string|max:20',
        ]);

        if (Schema::hasTable('pengumuman')) {
            CandyPengumuman::where('id_pengumuman', $id)->update([
                'judul' => $validated['judul'],
                'text' => $validated['text'],
                'type' => $validated['type'] ?? 'eksternal',
            ]);
        }

        return back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    /**
     * Delete announcement.
     */
    public function destroy($id): RedirectResponse
    {
        if (Schema::hasTable('pengumuman')) {
            CandyPengumuman::where('id_pengumuman', $id)->delete();
        }

        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
