<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalUjian extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_ujian',
        'bank_soal_id',
        'kelas_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'durasi_menit',
        'token',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'datetime',
            'tanggal_selesai' => 'datetime',
        ];
    }

    public function bankSoal(): BelongsTo
    {
        return $this->belongsTo(BankSoal::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function rekapNilais(): HasMany
    {
        return $this->hasMany(RekapNilai::class, 'jadwal_ujian_id');
    }
}
