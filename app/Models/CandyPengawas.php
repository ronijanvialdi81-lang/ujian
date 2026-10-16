<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyPengawas extends Model
{
    protected $table = 'pengawas';
    protected $primaryKey = 'id_pengawas';
    public $timestamps = false;
    protected $guarded = [];
}
