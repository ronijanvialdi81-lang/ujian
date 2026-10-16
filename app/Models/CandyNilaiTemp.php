<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyNilaiTemp extends Model
{
    protected $table = 'nilai_temp';
    protected $primaryKey = 'id_nilai';
    public $timestamps = false;
    protected $guarded = [];

    public function siswa()
    {
        return $this->belongsTo(CandySiswa::class, 'id_siswa', 'id_siswa');
    }

    public function ujian()
    {
        return $this->belongsTo(CandyUjian::class, 'id_ujian', 'id_ujian');
    }
}
