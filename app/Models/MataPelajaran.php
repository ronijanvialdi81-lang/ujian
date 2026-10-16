<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'kelompok',
    ];

    public function guru(): HasMany
    {
        return $this->hasMany(User::class, 'mata_pelajaran_id');
    }

    public function bankSoals(): HasMany
    {
        return $this->hasMany(BankSoal::class, 'mata_pelajaran_id');
    }
}
