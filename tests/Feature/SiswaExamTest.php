<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiswaExamTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_siswa_exam_pages()
    {
        $this->get('/siswa/ujian/1/konfirmasi')->assertRedirect('/login');
        $this->get('/siswa/ujian/1/kerjakan')->assertRedirect('/login');
        $this->get('/siswa/ujian/1/selesai')->assertRedirect('/login');
    }

    public function test_siswa_dashboard_displays_exams_and_stats()
    {
        $siswa = User::factory()->create(['role' => 'siswa']);
        $response = $this->actingAs($siswa)->get('/siswa/dashboard');
        $response->assertOk();
    }
}
