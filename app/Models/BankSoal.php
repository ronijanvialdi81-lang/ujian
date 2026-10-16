<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankSoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'judul',
        'mata_pelajaran_id',
        'guru_id',
        'tingkat',
        'jumlah_pg',
        'jumlah_esai',
        'durasi_menit',
        'status',
    ];

    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function jadwalUjians(): HasMany
    {
        return $this->hasMany(JadwalUjian::class, 'bank_soal_id');
    }
}
