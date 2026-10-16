<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandySoal extends Model
{
    protected $table = 'soal';
    protected $primaryKey = 'id_soal';
    public $timestamps = false;
    protected $guarded = [];

    public function mapel()
    {
        return $this->belongsTo(CandyMapel::class, 'id_mapel', 'id_mapel');
    }
}
