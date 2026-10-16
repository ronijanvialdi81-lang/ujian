<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandySetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display CBT settings & school profile.
     */
    public function index(): Response
    {
        $setting = null;
        if (Schema::hasTable('setting')) {
            $setting = CandySetting::first();
        }

        return Inertia::render('admin/pengaturan/index', [
            'setting' => $setting,
        ]);
    }

    /**
     * Update CBT settings & school profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sekolah' => 'required|string|max:50',
            'kode_sekolah' => 'nullable|string|max:10',
            'jenjang' => 'nullable|string|max:5',
            'kepsek' => 'nullable|string|max:50',
            'nip' => 'nullable|string|max:30',
            'npsn' => 'nullable|string|max:10',
            'alamat' => 'nullable|string',
            'kecamatan' => 'nullable|string|max:50',
            'kota' => 'nullable|string|max:30',
            'telp' => 'nullable|string|max:20',
            'email' => 'nullable|string|max:50',
            'web' => 'nullable|string|max:50',
            'header_kartu' => 'nullable|string',
            'nama_ujian' => 'nullable|string',
            'ip_server' => 'nullable|string|max:100',
            'id_server' => 'nullable|string|max:50',
        ]);

        if (Schema::hasTable('setting')) {
            $setting = CandySetting::first();
            if ($setting) {
                $setting->update($validated);
            } else {
                CandySetting::create($validated);
            }
        }

        return back()->with('success', 'Pengaturan sekolah dan CBT berhasil diperbarui.');
    }
}
