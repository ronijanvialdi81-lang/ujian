<?php

namespace Database\Seeders;

use App\Models\BankSoal;
use App\Models\JadwalUjian;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\RekapNilai;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Mata Pelajaran
        $mapelMtk = MataPelajaran::updateOrCreate(
            ['kode' => 'MTK-W'],
            ['nama' => 'Matematika Wajib', 'kelompok' => 'Umum']
        );
        $mapelBin = MataPelajaran::updateOrCreate(
            ['kode' => 'BIN-W'],
            ['nama' => 'Bahasa Indonesia', 'kelompok' => 'Umum']
        );
        $mapelBig = MataPelajaran::updateOrCreate(
            ['kode' => 'BIG-W'],
            ['nama' => 'Bahasa Inggris', 'kelompok' => 'Umum']
        );
        $mapelFis = MataPelajaran::updateOrCreate(
            ['kode' => 'FIS-P'],
            ['nama' => 'Fisika Peminatan', 'kelompok' => 'Peminatan MIPA']
        );
        $mapelKim = MataPelajaran::updateOrCreate(
            ['kode' => 'KIM-P'],
            ['nama' => 'Kimia Peminatan', 'kelompok' => 'Peminatan MIPA']
        );
        $mapelEko = MataPelajaran::updateOrCreate(
            ['kode' => 'EKO-P'],
            ['nama' => 'Ekonomi Peminatan', 'kelompok' => 'Peminatan IPS']
        );

        // 2. Kelas
        $k10Mipa1 = Kelas::updateOrCreate(['nama' => 'X MIPA 1'], ['tingkat' => '10', 'jurusan' => 'MIPA']);
        $k10Mipa2 = Kelas::updateOrCreate(['nama' => 'X MIPA 2'], ['tingkat' => '10', 'jurusan' => 'MIPA']);
        $k10Ips1 = Kelas::updateOrCreate(['nama' => 'X IPS 1'], ['tingkat' => '10', 'jurusan' => 'IPS']);
        $k11Mipa1 = Kelas::updateOrCreate(['nama' => 'XI MIPA 1'], ['tingkat' => '11', 'jurusan' => 'MIPA']);
        $k11Ips1 = Kelas::updateOrCreate(['nama' => 'XI IPS 1'], ['tingkat' => '11', 'jurusan' => 'IPS']);
        $k12Mipa1 = Kelas::updateOrCreate(['nama' => 'XII MIPA 1'], ['tingkat' => '12', 'jurusan' => 'MIPA']);

        // 3. User Admin
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator CBT',
                'email' => 'admin@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'status' => 'aktif',
                'phone' => '081234567890',
                'gender' => 'L',
            ]
        );

        // 4. User Guru
        $guruMtk = User::updateOrCreate(
            ['username' => 'guru'],
            [
                'name' => 'Budi Santoso, M.Pd',
                'email' => 'guru@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'guru',
                'mata_pelajaran_id' => $mapelMtk->id,
                'status' => 'aktif',
                'phone' => '082198765432',
                'gender' => 'L',
            ]
        );

        $guruBin = User::updateOrCreate(
            ['username' => '198803152014022001'],
            [
                'name' => 'Siti Aminah, S.Pd',
                'email' => 'siti.aminah@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'guru',
                'mata_pelajaran_id' => $mapelBin->id,
                'status' => 'aktif',
                'phone' => '085712345678',
                'gender' => 'P',
            ]
        );

        $guruBig = User::updateOrCreate(
            ['username' => '199011202019031003'],
            [
                'name' => 'Rudi Hermawan, S.Pd',
                'email' => 'rudi.hermawan@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'guru',
                'mata_pelajaran_id' => $mapelBig->id,
                'status' => 'aktif',
                'phone' => '081398761234',
                'gender' => 'L',
            ]
        );

        $guruFis = User::updateOrCreate(
            ['username' => '198205042008012004'],
            [
                'name' => 'Dewi Lestari, M.Si',
                'email' => 'dewi.lestari@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'guru',
                'mata_pelajaran_id' => $mapelFis->id,
                'status' => 'aktif',
                'phone' => '087812349876',
                'gender' => 'P',
            ]
        );

        // 5. User Siswa
        $siswa1 = User::updateOrCreate(
            ['username' => 'siswa'],
            [
                'name' => 'Ahmad Rizky Pratama',
                'email' => 'siswa@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'siswa',
                'kelas_id' => $k10Mipa1->id,
                'status' => 'aktif',
                'phone' => '089612345678',
                'gender' => 'L',
            ]
        );

        $siswa2 = User::updateOrCreate(
            ['username' => '20261002'],
            [
                'name' => 'Nabila Putri Zahra',
                'email' => 'nabila.putri@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'siswa',
                'kelas_id' => $k10Mipa1->id,
                'status' => 'aktif',
                'phone' => '089623456789',
                'gender' => 'P',
            ]
        );

        $siswa3 = User::updateOrCreate(
            ['username' => '20261003'],
            [
                'name' => 'Muhammad Fajar Ramadhan',
                'email' => 'm.fajar@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'siswa',
                'kelas_id' => $k10Mipa2->id,
                'status' => 'aktif',
                'phone' => '089634567890',
                'gender' => 'L',
            ]
        );

        $siswa4 = User::updateOrCreate(
            ['username' => '20261004'],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nur@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'siswa',
                'kelas_id' => $k10Ips1->id,
                'status' => 'aktif',
                'phone' => '089645678901',
                'gender' => 'P',
            ]
        );

        $siswa5 = User::updateOrCreate(
            ['username' => '20261005'],
            [
                'name' => 'Dimas Arya Saputra',
                'email' => 'dimas.arya@sekolah.sch.id',
                'password' => bcrypt('password'),
                'role' => 'siswa',
                'kelas_id' => $k11Mipa1->id,
                'status' => 'aktif',
                'phone' => '089656789012',
                'gender' => 'L',
            ]
        );

        // 6. Bank Soal
        $soalMtk = BankSoal::updateOrCreate(
            ['kode' => 'SOAL-MTK-X-2026'],
            [
                'judul' => 'Penilaian Akhir Semester (PAS) Matematika Wajib X',
                'mata_pelajaran_id' => $mapelMtk->id,
                'guru_id' => $guruMtk->id,
                'tingkat' => '10',
                'jumlah_pg' => 40,
                'jumlah_esai' => 5,
                'durasi_menit' => 90,
                'status' => 'aktif',
            ]
        );

        $soalBin = BankSoal::updateOrCreate(
            ['kode' => 'SOAL-BIN-X-2026'],
            [
                'judul' => 'Penilaian Akhir Semester (PAS) Bahasa Indonesia X',
                'mata_pelajaran_id' => $mapelBin->id,
                'guru_id' => $guruBin->id,
                'tingkat' => '10',
                'jumlah_pg' => 45,
                'jumlah_esai' => 5,
                'durasi_menit' => 90,
                'status' => 'aktif',
            ]
        );

        $soalBig = BankSoal::updateOrCreate(
            ['kode' => 'SOAL-BIG-XI-2026'],
            [
                'judul' => 'Ujian Tengah Semester Bahasa Inggris Kelas XI',
                'mata_pelajaran_id' => $mapelBig->id,
                'guru_id' => $guruBig->id,
                'tingkat' => '11',
                'jumlah_pg' => 40,
                'jumlah_esai' => 0,
                'durasi_menit' => 75,
                'status' => 'aktif',
            ]
        );

        $soalFis = BankSoal::updateOrCreate(
            ['kode' => 'SOAL-FIS-X-2026'],
            [
                'judul' => 'Ulangan Harian Kinematika Gerak Lurus Fisika X',
                'mata_pelajaran_id' => $mapelFis->id,
                'guru_id' => $guruFis->id,
                'tingkat' => '10',
                'jumlah_pg' => 30,
                'jumlah_esai' => 5,
                'durasi_menit' => 60,
                'status' => 'draft',
            ]
        );

        // 7. Jadwal Ujian
        $jadwal1 = JadwalUjian::updateOrCreate(
            ['nama_ujian' => 'PAS Matematika Wajib Kelas X'],
            [
                'bank_soal_id' => $soalMtk->id,
                'kelas_id' => $k10Mipa1->id,
                'tanggal_mulai' => Carbon::today()->setTime(7, 30),
                'tanggal_selesai' => Carbon::today()->setTime(9, 30),
                'durasi_menit' => 90,
                'token' => 'MTK01X',
                'status' => 'berlangsung',
            ]
        );

        $jadwal2 = JadwalUjian::updateOrCreate(
            ['nama_ujian' => 'PAS Bahasa Indonesia Kelas X'],
            [
                'bank_soal_id' => $soalBin->id,
                'kelas_id' => $k10Mipa1->id,
                'tanggal_mulai' => Carbon::tomorrow()->setTime(8, 0),
                'tanggal_selesai' => Carbon::tomorrow()->setTime(10, 0),
                'durasi_menit' => 90,
                'token' => 'BIN02X',
                'status' => 'akan_datang',
            ]
        );

        $jadwal3 = JadwalUjian::updateOrCreate(
            ['nama_ujian' => 'UTS Bahasa Inggris Kelas XI'],
            [
                'bank_soal_id' => $soalBig->id,
                'kelas_id' => $k11Mipa1->id,
                'tanggal_mulai' => Carbon::yesterday()->setTime(8, 0),
                'tanggal_selesai' => Carbon::yesterday()->setTime(9, 30),
                'durasi_menit' => 75,
                'token' => 'BIG03X',
                'status' => 'selesai',
            ]
        );

        // 8. Rekap Nilai
        RekapNilai::updateOrCreate(
            ['jadwal_ujian_id' => $jadwal1->id, 'siswa_id' => $siswa1->id],
            [
                'jumlah_benar' => 36,
                'jumlah_salah' => 4,
                'nilai_akhir' => 90.00,
                'status' => 'tuntas',
                'waktu_selesai' => Carbon::today()->setTime(8, 55),
            ]
        );

        RekapNilai::updateOrCreate(
            ['jadwal_ujian_id' => $jadwal1->id, 'siswa_id' => $siswa2->id],
            [
                'jumlah_benar' => 38,
                'jumlah_salah' => 2,
                'nilai_akhir' => 95.00,
                'status' => 'tuntas',
                'waktu_selesai' => Carbon::today()->setTime(8, 48),
            ]
        );

        RekapNilai::updateOrCreate(
            ['jadwal_ujian_id' => $jadwal3->id, 'siswa_id' => $siswa5->id],
            [
                'jumlah_benar' => 28,
                'jumlah_salah' => 12,
                'nilai_akhir' => 70.00,
                'status' => 'remedial',
                'waktu_selesai' => Carbon::yesterday()->setTime(9, 10),
            ]
        );
    }
}
