<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'admin'])->name('dashboard');

        // Data Guru
        Route::get('guru', [\App\Http\Controllers\Admin\GuruController::class, 'index'])->name('guru');
        Route::post('guru', [\App\Http\Controllers\Admin\GuruController::class, 'store'])->name('guru.store');
        Route::put('guru/{guru}', [\App\Http\Controllers\Admin\GuruController::class, 'update'])->name('guru.update');
        Route::delete('guru/{guru}', [\App\Http\Controllers\Admin\GuruController::class, 'destroy'])->name('guru.destroy');

        // Data Siswa
        Route::get('siswa', [\App\Http\Controllers\Admin\SiswaController::class, 'index'])->name('siswa');
        Route::post('siswa', [\App\Http\Controllers\Admin\SiswaController::class, 'store'])->name('siswa.store');
        Route::put('siswa/{siswa}', [\App\Http\Controllers\Admin\SiswaController::class, 'update'])->name('siswa.update');
        Route::delete('siswa/{siswa}', [\App\Http\Controllers\Admin\SiswaController::class, 'destroy'])->name('siswa.destroy');

        // Bank Soal
        Route::get('bank-soal', [\App\Http\Controllers\Admin\BankSoalController::class, 'index'])->name('bank-soal');
        Route::post('bank-soal', [\App\Http\Controllers\Admin\BankSoalController::class, 'store'])->name('bank-soal.store');
        Route::put('bank-soal/{bankSoal}', [\App\Http\Controllers\Admin\BankSoalController::class, 'update'])->name('bank-soal.update');
        Route::delete('bank-soal/{bankSoal}', [\App\Http\Controllers\Admin\BankSoalController::class, 'destroy'])->name('bank-soal.destroy');
        Route::get('bank-soal/{id}/soal', [\App\Http\Controllers\Admin\BankSoalController::class, 'soalIndex'])->name('bank-soal.soal');
        Route::post('bank-soal/{id}/soal', [\App\Http\Controllers\Admin\BankSoalController::class, 'soalStore'])->name('bank-soal.soal.store');
        Route::put('bank-soal/{id}/soal/{soalId}', [\App\Http\Controllers\Admin\BankSoalController::class, 'soalUpdate'])->name('bank-soal.soal.update');
        Route::delete('bank-soal/{id}/soal/{soalId}', [\App\Http\Controllers\Admin\BankSoalController::class, 'soalDestroy'])->name('bank-soal.soal.destroy');

        // Jadwal Ujian
        Route::get('jadwal-ujian', [\App\Http\Controllers\Admin\JadwalUjianController::class, 'index'])->name('jadwal-ujian');
        Route::post('jadwal-ujian', [\App\Http\Controllers\Admin\JadwalUjianController::class, 'store'])->name('jadwal-ujian.store');
        Route::put('jadwal-ujian/{jadwalUjian}', [\App\Http\Controllers\Admin\JadwalUjianController::class, 'update'])->name('jadwal-ujian.update');
        Route::delete('jadwal-ujian/{jadwalUjian}', [\App\Http\Controllers\Admin\JadwalUjianController::class, 'destroy'])->name('jadwal-ujian.destroy');

        // Rekap Nilai
        Route::get('rekap-nilai', [\App\Http\Controllers\Admin\RekapNilaiController::class, 'index'])->name('rekap-nilai');

        // Data Master
        Route::get('master', [\App\Http\Controllers\Admin\MasterController::class, 'index'])->name('master');
        Route::post('master', [\App\Http\Controllers\Admin\MasterController::class, 'store'])->name('master.store');
        Route::put('master/{id}', [\App\Http\Controllers\Admin\MasterController::class, 'update'])->name('master.update');
        Route::delete('master/{id}', [\App\Http\Controllers\Admin\MasterController::class, 'destroy'])->name('master.destroy');

        // Status Peserta
        Route::get('status-peserta', [\App\Http\Controllers\Admin\StatusPesertaController::class, 'index'])->name('status-peserta');
        Route::post('status-peserta/{id}/reset', [\App\Http\Controllers\Admin\StatusPesertaController::class, 'reset'])->name('status-peserta.reset');
        Route::post('status-peserta/{id}/finish', [\App\Http\Controllers\Admin\StatusPesertaController::class, 'finish'])->name('status-peserta.finish');

        // Token Ujian
        Route::get('token-ujian', [\App\Http\Controllers\Admin\TokenUjianController::class, 'index'])->name('token-ujian');
        Route::post('token-ujian/generate', [\App\Http\Controllers\Admin\TokenUjianController::class, 'generate'])->name('token-ujian.generate');

        // Cetak
        Route::get('cetak', [\App\Http\Controllers\Admin\CetakController::class, 'index'])->name('cetak');

        // Pengumuman
        Route::get('pengumuman', [\App\Http\Controllers\Admin\PengumumanController::class, 'index'])->name('pengumuman');
        Route::post('pengumuman', [\App\Http\Controllers\Admin\PengumumanController::class, 'store'])->name('pengumuman.store');
        Route::put('pengumuman/{id}', [\App\Http\Controllers\Admin\PengumumanController::class, 'update'])->name('pengumuman.update');
        Route::delete('pengumuman/{id}', [\App\Http\Controllers\Admin\PengumumanController::class, 'destroy'])->name('pengumuman.destroy');

        // Manajemen User: Administrator & Proktor
        Route::get('pengawas', [\App\Http\Controllers\Admin\PengawasController::class, 'index'])->name('pengawas');
        Route::post('pengawas', [\App\Http\Controllers\Admin\PengawasController::class, 'store'])->name('pengawas.store');
        Route::put('pengawas/{id}', [\App\Http\Controllers\Admin\PengawasController::class, 'update'])->name('pengawas.update');
        Route::delete('pengawas/{id}', [\App\Http\Controllers\Admin\PengawasController::class, 'destroy'])->name('pengawas.destroy');

        // Pengaturan
        Route::get('pengaturan', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('pengaturan');
        Route::post('pengaturan', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('pengaturan.update');
    });

    // Guru routes
    Route::middleware(['role:guru'])->prefix('guru')->name('guru.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'guru'])->name('dashboard');
    });

    // Siswa routes
    Route::middleware(['role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'siswa'])->name('dashboard');

        // Ujian Siswa
        Route::get('ujian/{id}/konfirmasi', [\App\Http\Controllers\Siswa\UjianController::class, 'konfirmasi'])->name('ujian.konfirmasi');
        Route::post('ujian/{id}/mulai', [\App\Http\Controllers\Siswa\UjianController::class, 'start'])->name('ujian.mulai');
        Route::get('ujian/{id}/kerjakan', [\App\Http\Controllers\Siswa\UjianController::class, 'show'])->name('ujian.kerjakan');
        Route::post('ujian/{id}/simpan', [\App\Http\Controllers\Siswa\UjianController::class, 'simpanJawaban'])->name('ujian.simpan');
        Route::post('ujian/{id}/selesai', [\App\Http\Controllers\Siswa\UjianController::class, 'selesai'])->name('ujian.selesai.post');
        Route::get('ujian/{id}/selesai', [\App\Http\Controllers\Siswa\UjianController::class, 'hasil'])->name('ujian.selesai');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
