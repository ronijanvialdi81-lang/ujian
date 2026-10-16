<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyRuang extends Model
{
    protected $table = 'ruang';
    protected $primaryKey = 'kode_ruang';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = [];
}
