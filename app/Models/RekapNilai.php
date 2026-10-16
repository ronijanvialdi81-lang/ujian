<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekapNilai extends Model
{
    use HasFactory;

    protected $fillable = [
        'jadwal_ujian_id',
        'siswa_id',
        'jumlah_benar',
        'jumlah_salah',
        'nilai_akhir',
        'status',
        'waktu_selesai',
    ];

    protected function casts(): array
    {
        return [
            'nilai_akhir' => 'float',
            'waktu_selesai' => 'datetime',
        ];
    }

    public function jadwalUjian(): BelongsTo
    {
        return $this->belongsTo(JadwalUjian::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }
}
