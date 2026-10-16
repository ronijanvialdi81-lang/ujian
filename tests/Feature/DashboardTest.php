<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_users_are_redirected_to_their_role_dashboard()
    {
        $siswa = User::factory()->create(['role' => 'siswa']);
        $this->actingAs($siswa)->get('/dashboard')->assertRedirect(route('siswa.dashboard'));

        $guru = User::factory()->create(['role' => 'guru']);
        $this->actingAs($guru)->get('/dashboard')->assertRedirect(route('guru.dashboard'));

        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->get('/dashboard')->assertRedirect(route('admin.dashboard'));
    }

    public function test_admin_can_visit_admin_dashboard()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->get('/admin/dashboard')->assertOk();
    }

    public function test_guru_can_visit_guru_dashboard()
    {
        $guru = User::factory()->create(['role' => 'guru']);
        $this->actingAs($guru)->get('/guru/dashboard')->assertOk();
    }

    public function test_siswa_can_visit_siswa_dashboard()
    {
        $siswa = User::factory()->create(['role' => 'siswa']);
        $this->actingAs($siswa)->get('/siswa/dashboard')->assertOk();
    }

    public function test_siswa_cannot_visit_admin_dashboard()
    {
        $siswa = User::factory()->create(['role' => 'siswa']);
        $this->actingAs($siswa)->get('/admin/dashboard')->assertRedirect(route('dashboard'));
    }

    public function test_admin_can_visit_all_platform_management_pages()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin/guru')->assertOk();
        $this->actingAs($admin)->get('/admin/siswa')->assertOk();
        $this->actingAs($admin)->get('/admin/bank-soal')->assertOk();
        $this->actingAs($admin)->get('/admin/jadwal-ujian')->assertOk();
        $this->actingAs($admin)->get('/admin/rekap-nilai')->assertOk();
        $this->actingAs($admin)->get('/admin/master')->assertOk();
        $this->actingAs($admin)->get('/admin/status-peserta')->assertOk();
        $this->actingAs($admin)->get('/admin/token-ujian')->assertOk();
        $this->actingAs($admin)->get('/admin/cetak')->assertOk();
        $this->actingAs($admin)->get('/admin/pengumuman')->assertOk();
        $this->actingAs($admin)->get('/admin/pengawas')->assertOk();
        $this->actingAs($admin)->get('/admin/pengaturan')->assertOk();
    }
}
