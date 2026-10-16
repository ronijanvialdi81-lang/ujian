<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyLog extends Model
{
    protected $table = 'log';
    protected $primaryKey = 'id_log';
    public $timestamps = false;
    protected $guarded = [];

    public function siswa()
    {
        return $this->belongsTo(CandySiswa::class, 'id_siswa', 'id_siswa');
    }
}
