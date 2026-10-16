<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandySiswa extends Model
{
    protected $table = 'siswa';
    protected $primaryKey = 'id_siswa';
    public $timestamps = false;
    protected $guarded = [];

    public function kelas()
    {
        return $this->belongsTo(CandyKelas::class, 'id_kelas', 'id_kelas');
    }

    public function nilais()
    {
        return $this->hasMany(CandyNilai::class, 'id_siswa', 'id_siswa');
    }
}
