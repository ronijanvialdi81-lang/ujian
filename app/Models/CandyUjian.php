<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyUjian extends Model
{
    protected $table = 'ujian';
    protected $primaryKey = 'id_ujian';
    public $timestamps = false;
    protected $guarded = [];

    public function mapel()
    {
        return $this->belongsTo(CandyMapel::class, 'id_mapel', 'id_mapel');
    }

    public function nilais()
    {
        return $this->hasMany(CandyNilai::class, 'id_ujian', 'id_ujian');
    }
}
