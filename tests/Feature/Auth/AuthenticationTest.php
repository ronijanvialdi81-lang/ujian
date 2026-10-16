<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_admin_can_authenticate_and_redirect_to_admin_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'username' => 'admin_test',
        ]);

        $response = $this->post('/login', [
            'login' => 'admin_test',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_guru_can_authenticate_and_redirect_to_guru_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'guru',
            'username' => 'guru_test',
        ]);

        $response = $this->post('/login', [
            'login' => 'guru_test',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('guru.dashboard', absolute: false));
    }

    public function test_siswa_can_authenticate_using_email_or_username()
    {
        $user = User::factory()->create([
            'role' => 'siswa',
            'username' => 'siswa_test',
        ]);

        $response = $this->post('/login', [
            'login' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('siswa.dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'login' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
