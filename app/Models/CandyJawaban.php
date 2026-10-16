<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyJawaban extends Model
{
    protected $table = 'jawaban';
    protected $primaryKey = 'id_jawaban';
    public $timestamps = false;
    protected $guarded = [];

    public function soal()
    {
        return $this->belongsTo(CandySoal::class, 'id_soal', 'id_soal');
    }

    public function siswa()
    {
        return $this->belongsTo(CandySiswa::class, 'id_siswa', 'id_siswa');
    }

    public function ujian()
    {
        return $this->belongsTo(CandyUjian::class, 'id_ujian', 'id_ujian');
    }
}
