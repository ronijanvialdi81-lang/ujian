<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyMapel extends Model
{
    protected $table = 'mapel';
    protected $primaryKey = 'id_mapel';
    public $timestamps = false;
    protected $guarded = [];

    public function soals()
    {
        return $this->hasMany(CandySoal::class, 'id_mapel', 'id_mapel');
    }

    public function ujians()
    {
        return $this->hasMany(CandyUjian::class, 'id_mapel', 'id_mapel');
    }
}
