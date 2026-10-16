<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyKelas;
use App\Models\CandyLevel;
use App\Models\CandyMataPelajaran;
use App\Models\CandyPk;
use App\Models\CandyRuang;
use App\Models\CandyServer;
use App\Models\CandySesi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class MasterController extends Controller
{
    /**
     * Display Data Master (Mata Pelajaran, Kelas, Ruang, Sesi, Jurusan/PK, Level, Server).
     */
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'mapel');
        $search = $request->query('search', '');

        $counts = [
            'mapel' => Schema::hasTable('mata_pelajaran') ? CandyMataPelajaran::count() : 0,
            'kelas' => Schema::hasTable('kelas') ? CandyKelas::count() : 0,
            'ruang' => Schema::hasTable('ruang') ? CandyRuang::count() : 0,
            'sesi' => Schema::hasTable('sesi') ? CandySesi::count() : 0,
            'jurusan' => Schema::hasTable('pk') ? CandyPk::count() : 0,
            'level' => Schema::hasTable('level') ? CandyLevel::count() : 0,
            'server' => Schema::hasTable('server') ? CandyServer::count() : 0,
        ];

        $data = [
            'activeTab' => $tab,
            'search' => $search,
            'counts' => $counts,
            'mapel' => [],
            'kelas' => [],
            'ruang' => [],
            'sesi' => [],
            'jurusan' => [],
            'level' => [],
            'server' => [],
        ];

        if (Schema::hasTable('mata_pelajaran')) {
            $q = CandyMataPelajaran::query();
            if ($tab === 'mapel' && $search) {
                $q->where('nama_mapel', 'like', "%{$search}%")->orWhere('kode_mapel', 'like', "%{$search}%");
            }
            $data['mapel'] = $q->orderBy('kode_mapel')->paginate(20)->withQueryString();
        }

        if (Schema::hasTable('kelas')) {
            $q = CandyKelas::query();
            if ($tab === 'kelas' && $search) {
                $q->where('nama', 'like', "%{$search}%")->orWhere('id_kelas', 'like', "%{$search}%");
            }
            $data['kelas'] = $q->orderBy('nama')->paginate(20)->withQueryString();
        }

        if (Schema::hasTable('ruang')) {
            $q = CandyRuang::query();
            if ($tab === 'ruang' && $search) {
                $q->where('keterangan', 'like', "%{$search}%")->orWhere('kode_ruang', 'like', "%{$search}%");
            }
            $data['ruang'] = $q->orderBy('kode_ruang')->paginate(20)->withQueryString();
        }

        if (Schema::hasTable('sesi')) {
            $q = CandySesi::query();
            if ($tab === 'sesi' && $search) {
                $q->where('nama_sesi', 'like', "%{$search}%")->orWhere('kode_sesi', 'like', "%{$search}%");
            }
            $data['sesi'] = $q->orderBy('kode_sesi')->paginate(20)->withQueryString();
        }

        if (Schema::hasTable('pk')) {
            $q = CandyPk::query();
            if ($tab === 'jurusan' && $search) {
                $q->where('program_keahlian', 'like', "%{$search}%")->orWhere('id_pk', 'like', "%{$search}%");
            }
            $data['jurusan'] = $q->orderBy('id_pk')->paginate(20)->withQueryString();
        }

        if (Schema::hasTable('level')) {
            $q = CandyLevel::query();
            if ($tab === 'level' && $search) {
                $q->where('keterangan', 'like', "%{$search}%")->orWhere('kode_level', 'like', "%{$search}%");
            }
            $data['level'] = $q->orderBy('kode_level')->paginate(20)->withQueryString();
        }

        if (Schema::hasTable('server')) {
            $q = CandyServer::query();
            if ($tab === 'server' && $search) {
                $q->where('nama_server', 'like', "%{$search}%")->orWhere('kode_server', 'like', "%{$search}%");
            }
            $data['server'] = $q->orderBy('kode_server')->paginate(20)->withQueryString();
        }

        return Inertia::render('admin/master/index', $data);
    }

    /**
     * Store new master item.
     */
    public function store(Request $request): RedirectResponse
    {
        $tab = $request->input('tab', 'mapel');

        if ($tab === 'mapel' && Schema::hasTable('mata_pelajaran')) {
            $validated = $request->validate([
                'kode_mapel' => 'required|string|max:20',
                'nama_mapel' => 'required|string|max:50',
            ]);
            CandyMataPelajaran::create($validated);
        } elseif ($tab === 'kelas' && Schema::hasTable('kelas')) {
            $validated = $request->validate([
                'id_kelas' => 'required|string|max:11',
                'nama' => 'required|string|max:30',
                'level' => 'required|string|max:20',
            ]);
            CandyKelas::create($validated);
        } elseif ($tab === 'ruang' && Schema::hasTable('ruang')) {
            $validated = $request->validate([
                'kode_ruang' => 'required|string|max:10',
                'keterangan' => 'required|string|max:30',
            ]);
            CandyRuang::create($validated);
        } elseif ($tab === 'sesi' && Schema::hasTable('sesi')) {
            $validated = $request->validate([
                'kode_sesi' => 'required|string|max:10',
                'nama_sesi' => 'required|string|max:30',
            ]);
            CandySesi::create($validated);
        } elseif ($tab === 'jurusan' && Schema::hasTable('pk')) {
            $validated = $request->validate([
                'id_pk' => 'required|string|max:10',
                'program_keahlian' => 'required|string|max:50',
            ]);
            CandyPk::create($validated);
        } elseif ($tab === 'level' && Schema::hasTable('level')) {
            $validated = $request->validate([
                'kode_level' => 'required|string|max:5',
                'keterangan' => 'required|string|max:50',
            ]);
            CandyLevel::create($validated);
        } elseif ($tab === 'server' && Schema::hasTable('server')) {
            $validated = $request->validate([
                'kode_server' => 'required|string|max:20',
                'nama_server' => 'required|string|max:30',
                'status' => 'required|string|max:15',
            ]);
            CandyServer::create($validated);
        }

        return redirect()->route('admin.master', ['tab' => $tab])->with('success', 'Data master berhasil ditambahkan.');
    }

    /**
     * Delete a master item.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $tab = $request->input('tab', 'mapel');

        if ($tab === 'mapel' && Schema::hasTable('mata_pelajaran')) {
            CandyMataPelajaran::where('kode_mapel', $id)->delete();
        } elseif ($tab === 'kelas' && Schema::hasTable('kelas')) {
            CandyKelas::where('id_kelas', $id)->delete();
        } elseif ($tab === 'ruang' && Schema::hasTable('ruang')) {
            CandyRuang::where('kode_ruang', $id)->delete();
        } elseif ($tab === 'sesi' && Schema::hasTable('sesi')) {
            CandySesi::where('kode_sesi', $id)->delete();
        } elseif ($tab === 'jurusan' && Schema::hasTable('pk')) {
            CandyPk::where('id_pk', $id)->delete();
        } elseif ($tab === 'level' && Schema::hasTable('level')) {
            CandyLevel::where('kode_level', $id)->delete();
        } elseif ($tab === 'server' && Schema::hasTable('server')) {
            CandyServer::where('kode_server', $id)->delete();
        }

        return redirect()->route('admin.master', ['tab' => $tab])->with('success', 'Data master berhasil dihapus.');
    }
}
