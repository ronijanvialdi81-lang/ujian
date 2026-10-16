<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyNilai extends Model
{
    protected $table = 'nilai';
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

    public function mapel()
    {
        return $this->belongsTo(CandyMapel::class, 'id_mapel', 'id_mapel');
    }
}
