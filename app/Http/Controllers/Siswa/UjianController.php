<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\CandyJawaban;
use App\Models\CandyMapel;
use App\Models\CandyNilai;
use App\Models\CandySiswa;
use App\Models\CandySoal;
use App\Models\CandyToken;
use App\Models\CandyUjian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class UjianController extends Controller
{
    /**
     * Get the active CandySiswa for the current user.
     */
    protected function getActiveSiswa(): ?CandySiswa
    {
        if (! Schema::hasTable('siswa')) {
            return null;
        }

        $user = auth()->user();
        $siswa = CandySiswa::where('username', $user->username)->first();

        if (! $siswa) {
            $siswa = CandySiswa::first();
        }

        return $siswa;
    }

    /**
     * Display confirmation before starting the exam.
     */
    public function konfirmasi($id): Response|RedirectResponse
    {
        if (! Schema::hasTable('ujian')) {
            return redirect()->route('siswa.dashboard')->with('error', 'Tabel ujian belum tersedia.');
        }

        $ujian = CandyUjian::with('mapel')->findOrFail($id);
        $siswa = $this->getActiveSiswa();

        // Check if student already finished this exam
        if ($siswa && Schema::hasTable('nilai')) {
            $nilai = CandyNilai::where('id_ujian', $id)
                ->where('id_siswa', $siswa->id_siswa)
                ->first();

            if ($nilai && (int) $nilai->status === 1) {
                return redirect()->route('siswa.ujian.selesai', $id);
            }
        }

        // Check active token
        $currentToken = '';
        if (Schema::hasTable('token')) {
            $tokenObj = CandyToken::orderByDesc('id_token')->first();
            $currentToken = $tokenObj ? $tokenObj->token : 'CBT2026';
        }

        return Inertia::render('siswa/ujian/konfirmasi', [
            'ujian' => [
                'id_ujian' => $ujian->id_ujian,
                'nama' => $ujian->nama,
                'kode_ujian' => $ujian->kode_ujian,
                'mapel' => $ujian->mapel ? $ujian->mapel->nama : ($ujian->kode_nama ?: 'Ujian Sekolah'),
                'guru' => $ujian->mapel ? $ujian->mapel->guru : 'Guru Mata Pelajaran',
                'lama_ujian' => $ujian->lama_ujian ?: 60,
                'jml_soal' => $ujian->jml_soal ?: 30,
                'jml_esai' => $ujian->jml_esai ?: 0,
                'token_required' => (int) $ujian->token === 1,
            ],
            'siswa' => $siswa ? [
                'id_siswa' => $siswa->id_siswa,
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'nisn' => $siswa->nisn ?: $siswa->username,
                'kelas' => $siswa->id_kelas,
                'sesi' => $siswa->sesi,
                'ruang' => $siswa->ruang,
            ] : [
                'id_siswa' => 1,
                'nama' => auth()->user()->name,
                'nis' => auth()->user()->username,
                'nisn' => auth()->user()->username,
                'kelas' => 'X MIPA 1',
                'sesi' => '1',
                'ruang' => 'LAB-1',
            ],
            'serverToken' => $currentToken,
        ]);
    }

    /**
     * Start the exam and redirect to CBT room.
     */
    public function start(Request $request, $id): RedirectResponse
    {
        if (! Schema::hasTable('ujian')) {
            return redirect()->route('siswa.dashboard');
        }

        $ujian = CandyUjian::findOrFail($id);

        if ((int) $ujian->token === 1) {
            $request->validate([
                'token' => 'required|string',
            ]);

            $currentToken = 'CBT2026';
            if (Schema::hasTable('token')) {
                $tokenObj = CandyToken::orderByDesc('id_token')->first();
                if ($tokenObj) {
                    $currentToken = $tokenObj->token;
                }
            }

            if (strtoupper(trim($request->input('token'))) !== strtoupper(trim($currentToken))) {
                return back()->withErrors(['token' => 'Token ujian tidak valid atau telah kedaluwarsa!']);
            }
        }

        $siswa = $this->getActiveSiswa();
        $siswaId = $siswa ? $siswa->id_siswa : 1;

        if (Schema::hasTable('nilai')) {
            $nilai = CandyNilai::where('id_ujian', $id)
                ->where('id_siswa', $siswaId)
                ->first();

            if (! $nilai) {
                CandyNilai::create([
                    'id_ujian' => $id,
                    'id_mapel' => $ujian->id_mapel ?: 1,
                    'id_siswa' => $siswaId,
                    'kode_ujian' => $ujian->kode_ujian ?: 'CBT',
                    'ujian_mulai' => date('Y-m-d H:i:s'),
                    'ujian_berlangsung' => date('Y-m-d H:i:s'),
                    'jml_benar' => 0,
                    'jml_salah' => 0,
                    'skor' => '0',
                    'total' => '0',
                    'hasil' => 0,
                    'status' => 0,
                    'online' => 1,
                    'blok' => 0,
                ]);
            }
        }

        return redirect()->route('siswa.ujian.kerjakan', $id);
    }

    /**
     * Display the CBT Exam Room (Lembar Ujian Siswa).
     */
    public function show($id): Response|RedirectResponse
    {
        if (! Schema::hasTable('ujian')) {
            return redirect()->route('siswa.dashboard');
        }

        $ujian = CandyUjian::with('mapel')->findOrFail($id);
        $siswa = $this->getActiveSiswa();
        $siswaId = $siswa ? $siswa->id_siswa : 1;

        $nilai = null;
        if (Schema::hasTable('nilai')) {
            $nilai = CandyNilai::where('id_ujian', $id)
                ->where('id_siswa', $siswaId)
                ->first();

            // If already completed, redirect to completion page
            if ($nilai && (int) $nilai->status === 1) {
                return redirect()->route('siswa.ujian.selesai', $id);
            }

            // Create test session record if not created yet
            if (! $nilai) {
                $nilai = CandyNilai::create([
                    'id_ujian' => $id,
                    'id_mapel' => $ujian->id_mapel ?: 1,
                    'id_siswa' => $siswaId,
                    'kode_ujian' => $ujian->kode_ujian ?: 'CBT',
                    'ujian_mulai' => date('Y-m-d H:i:s'),
                    'ujian_berlangsung' => date('Y-m-d H:i:s'),
                    'jml_benar' => 0,
                    'jml_salah' => 0,
                    'skor' => '0',
                    'total' => '0',
                    'hasil' => 0,
                    'status' => 0,
                    'online' => 1,
                    'blok' => 0,
                ]);
            }
        }

        // Calculate remaining seconds
        $lamaMenit = (int) ($ujian->lama_ujian ?: 60);
        $totalDetik = $lamaMenit * 60;
        $mulaiTimestamp = $nilai && ! empty($nilai->ujian_mulai) ? strtotime($nilai->ujian_mulai) : time();
        $elapsed = time() - $mulaiTimestamp;
        $sisaDetik = max(10, $totalDetik - $elapsed);

        // Fetch questions from soal table
        $questions = [];
        if (Schema::hasTable('soal')) {
            $soalQuery = CandySoal::where('id_mapel', $ujian->id_mapel);
            if ($ujian->jml_soal > 0) {
                $soalQuery->limit($ujian->jml_soal);
            }
            $rawSoal = $soalQuery->orderBy('nomor')->get();

            // Sanitize: strip out correct answer key so student cannot cheat via inspecting payload
            $questions = $rawSoal->map(function ($s, $index) {
                return [
                    'id_soal' => $s->id_soal,
                    'nomor' => $index + 1,
                    'soal' => $s->soal,
                    'jenis' => (int) $s->jenis === 2 ? 'esai' : 'pg',
                    'pilA' => $s->pilA,
                    'pilB' => $s->pilB,
                    'pilC' => $s->pilC,
                    'pilD' => $s->pilD,
                    'pilE' => $s->pilE,
                    'file' => $s->file,
                    'file1' => $s->file1,
                    'fileA' => $s->fileA,
                    'fileB' => $s->fileB,
                    'fileC' => $s->fileC,
                    'fileD' => $s->fileD,
                    'fileE' => $s->fileE,
                ];
            });
        }

        // Fallback dummy questions if database has no questions for this test
        if (empty($questions) || count($questions) === 0) {
            $questions = collect([
                [
                    'id_soal' => 1,
                    'nomor' => 1,
                    'soal' => '<p>Manakah pernyataan berikut ini yang paling tepat mengenai prinsip dasar keselamatan kerja di laboratorium komputer sekolah?</p>',
                    'jenis' => 'pg',
                    'pilA' => '<p>Memastikan seluruh instalasi kabel tertata rapi dan tidak terkena cairan.</p>',
                    'pilB' => '<p>Menyalakan seluruh komputer sekaligus saat kondisi listrik tidak stabil.</p>',
                    'pilC' => '<p>Membawa makanan dan minuman ke meja komputer selama pengujian.</p>',
                    'pilD' => '<p>Membuka penutup casing CPU saat komputer sedang beroperasi.</p>',
                    'pilE' => '<p>Menggunakan satu stop kontak untuk belasan perangkat berdaya tinggi.</p>',
                    'file' => null, 'file1' => null, 'fileA' => null, 'fileB' => null, 'fileC' => null, 'fileD' => null, 'fileE' => null,
                ],
                [
                    'id_soal' => 2,
                    'nomor' => 2,
                    'soal' => '<p>Perangkat keras komputer yang berfungsi memproses instruksi logika dan aritmatika utama adalah...</p>',
                    'jenis' => 'pg',
                    'pilA' => '<p>Harddisk Drive (HDD)</p>',
                    'pilB' => '<p>Central Processing Unit (CPU)</p>',
                    'pilC' => '<p>Random Access Memory (RAM)</p>',
                    'pilD' => '<p>Power Supply Unit (PSU)</p>',
                    'pilE' => '<p>Video Graphics Array (VGA)</p>',
                    'file' => null, 'file1' => null, 'fileA' => null, 'fileB' => null, 'fileC' => null, 'fileD' => null, 'fileE' => null,
                ],
            ]);
        }

        // Fetch existing answers for this student
        $answers = [];
        if (Schema::hasTable('jawaban')) {
            $storedAnswers = CandyJawaban::where('id_ujian', $id)
                ->where('id_siswa', $siswaId)
                ->get();

            foreach ($storedAnswers as $ans) {
                $answers[$ans->id_soal] = [
                    'jawaban' => $ans->jawaban,
                    'esai' => $ans->esai,
                    'ragu' => (int) $ans->ragu === 1,
                ];
            }
        }

        return Inertia::render('siswa/ujian/kerjakan', [
            'ujian' => [
                'id_ujian' => $ujian->id_ujian,
                'nama' => $ujian->nama,
                'kode_ujian' => $ujian->kode_ujian,
                'mapel' => $ujian->mapel ? $ujian->mapel->nama : ($ujian->kode_nama ?: 'Ujian Sekolah'),
                'lama_ujian' => $lamaMenit,
                'total_soal' => count($questions),
            ],
            'siswa' => $siswa ? [
                'id_siswa' => $siswa->id_siswa,
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'nisn' => $siswa->nisn ?: $siswa->username,
                'kelas' => $siswa->id_kelas,
                'ruang' => $siswa->ruang,
                'sesi' => $siswa->sesi,
            ] : [
                'id_siswa' => 1,
                'nama' => auth()->user()->name,
                'nis' => auth()->user()->username,
                'nisn' => auth()->user()->username,
                'kelas' => 'X MIPA 1',
                'ruang' => 'LAB-1',
                'sesi' => '1',
            ],
            'questions' => $questions,
            'initialAnswers' => $answers,
            'sisaDetik' => $sisaDetik,
        ]);
    }

    /**
     * Auto-save single question answer via AJAX / Inertia.
     */
    public function simpanJawaban(Request $request, $id)
    {
        $validated = $request->validate([
            'id_soal' => 'required|integer',
            'jawaban' => 'nullable|string|max:5',
            'esai' => 'nullable|string',
            'ragu' => 'nullable|boolean',
        ]);

        $siswa = $this->getActiveSiswa();
        $siswaId = $siswa ? $siswa->id_siswa : 1;

        if (Schema::hasTable('jawaban')) {
            $soal = Schema::hasTable('soal') ? CandySoal::find($validated['id_soal']) : null;
            $jenis = $soal ? (int) $soal->jenis : 1;

            CandyJawaban::updateOrCreate(
                [
                    'id_ujian' => $id,
                    'id_siswa' => $siswaId,
                    'id_soal' => $validated['id_soal'],
                ],
                [
                    'id_mapel' => $request->input('id_mapel', $soal ? $soal->id_mapel : 1),
                    'jenis' => $jenis,
                    'jawaban' => $validated['jawaban'] ?? null,
                    'jawabx' => $validated['jawaban'] ?? null,
                    'esai' => $validated['esai'] ?? null,
                    'nilai_esai' => 0,
                    'ragu' => ! empty($validated['ragu']) ? 1 : 0,
                ]
            );
        }

        // Touch ujian_berlangsung timestamp in nilai table
        if (Schema::hasTable('nilai')) {
            CandyNilai::where('id_ujian', $id)
                ->where('id_siswa', $siswaId)
                ->update(['ujian_berlangsung' => date('Y-m-d H:i:s')]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Jawaban berhasil disimpan.',
        ]);
    }

    /**
     * Submit and finish the exam.
     */
    public function selesai(Request $request, $id): RedirectResponse
    {
        $siswa = $this->getActiveSiswa();
        $siswaId = $siswa ? $siswa->id_siswa : 1;

        $ujian = Schema::hasTable('ujian') ? CandyUjian::find($id) : null;
        $totalPg = 0;
        $benar = 0;
        $salah = 0;
        $skor = 0;

        if (Schema::hasTable('soal') && Schema::hasTable('jawaban')) {
            $soalList = CandySoal::where('id_mapel', $ujian ? $ujian->id_mapel : 0)->get()->keyBy('id_soal');
            $jawabanList = CandyJawaban::where('id_ujian', $id)
                ->where('id_siswa', $siswaId)
                ->get();

            $totalPg = $soalList->count();

            foreach ($jawabanList as $jwb) {
                if (isset($soalList[$jwb->id_soal])) {
                    $kunci = strtoupper(trim($soalList[$jwb->id_soal]->jawaban));
                    $jawabanSiswa = strtoupper(trim($jwb->jawaban));

                    if (! empty($jawabanSiswa) && $jawabanSiswa === $kunci) {
                        $benar++;
                    } else {
                        $salah++;
                    }
                }
            }

            if ($totalPg > 0) {
                $skor = round(($benar / $totalPg) * 100, 1);
            }
        }

        if (Schema::hasTable('nilai')) {
            CandyNilai::updateOrCreate(
                [
                    'id_ujian' => $id,
                    'id_siswa' => $siswaId,
                ],
                [
                    'id_mapel' => $ujian ? $ujian->id_mapel : 1,
                    'kode_ujian' => $ujian ? $ujian->kode_ujian : 'CBT',
                    'ujian_selesai' => date('Y-m-d H:i:s'),
                    'jml_benar' => $benar,
                    'jml_salah' => max(0, $totalPg - $benar),
                    'skor' => (string) $skor,
                    'total' => (string) $skor,
                    'hasil' => 0,
                    'status' => 1,
                    'online' => 0,
                    'blok' => 0,
                ]
            );
        }

        return redirect()->route('siswa.ujian.selesai', $id);
    }

    /**
     * Display completion & result page.
     */
    public function hasil($id): Response
    {
        $ujian = Schema::hasTable('ujian') ? CandyUjian::with('mapel')->find($id) : null;
        $siswa = $this->getActiveSiswa();
        $siswaId = $siswa ? $siswa->id_siswa : 1;

        $nilai = null;
        if (Schema::hasTable('nilai')) {
            $nilai = CandyNilai::where('id_ujian', $id)
                ->where('id_siswa', $siswaId)
                ->first();
        }

        return Inertia::render('siswa/ujian/selesai', [
            'ujian' => [
                'id_ujian' => $id,
                'nama' => $ujian ? $ujian->nama : 'Ujian CBT',
                'mapel' => $ujian && $ujian->mapel ? $ujian->mapel->nama : ($ujian ? $ujian->kode_nama : 'Mata Pelajaran'),
                'tampil_hasil' => $ujian ? ((int) $ujian->hasil === 1) : true,
            ],
            'nilai' => $nilai ? [
                'total' => $nilai->total,
                'jml_benar' => $nilai->jml_benar,
                'jml_salah' => $nilai->jml_salah,
                'ujian_mulai' => $nilai->ujian_mulai,
                'ujian_selesai' => $nilai->ujian_selesai,
            ] : null,
            'siswa' => $siswa ? [
                'nama' => $siswa->nama,
                'nisn' => $siswa->nisn ?: $siswa->username,
                'kelas' => $siswa->id_kelas,
            ] : [
                'nama' => auth()->user()->name,
                'nisn' => auth()->user()->username,
                'kelas' => 'X MIPA 1',
            ],
        ]);
    }
}
