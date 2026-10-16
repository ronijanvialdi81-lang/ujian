<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'nama',
        'tingkat',
        'jurusan',
    ];

    public function siswa(): HasMany
    {
        return $this->hasMany(User::class, 'kelas_id');
    }

    public function jadwalUjians(): HasMany
    {
        return $this->hasMany(JadwalUjian::class, 'kelas_id');
    }
}
