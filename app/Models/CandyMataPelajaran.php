<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyMataPelajaran extends Model
{
    protected $table = 'mata_pelajaran';
    protected $primaryKey = 'mata_pelajaran_id';
    public $timestamps = false;
    protected $guarded = [];
}
