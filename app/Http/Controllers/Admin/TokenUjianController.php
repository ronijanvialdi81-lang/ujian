<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CandyToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TokenUjianController extends Controller
{
    /**
     * Display Token Ujian page.
     */
    public function index(): Response
    {
        $tokenData = null;

        if (Schema::hasTable('token')) {
            $tokenData = CandyToken::first();
            if (! $tokenData) {
                $tokenData = CandyToken::create([
                    'token' => strtoupper(Str::random(6)),
                    'time' => date('Y-m-d H:i:s'),
                    'masa_berlaku' => '00:15:00',
                ]);
            }
        }

        return Inertia::render('admin/token-ujian/index', [
            'token' => $tokenData,
        ]);
    }

    /**
     * Generate a new token.
     */
    public function generate(Request $request): RedirectResponse
    {
        if (Schema::hasTable('token')) {
            // Generate 6 random uppercase chars
            $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            $newToken = substr(str_shuffle($chars), 0, 6);

            $tokenRow = CandyToken::first();
            if ($tokenRow) {
                $tokenRow->update([
                    'token' => $newToken,
                    'time' => date('Y-m-d H:i:s'),
                ]);
            } else {
                CandyToken::create([
                    'token' => $newToken,
                    'time' => date('Y-m-d H:i:s'),
                    'masa_berlaku' => '00:15:00',
                ]);
            }
        }

        return back()->with('success', 'Token ujian baru berhasil digenerate.');
    }
}
