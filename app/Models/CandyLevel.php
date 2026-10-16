<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyLevel extends Model
{
    protected $table = 'level';
    protected $primaryKey = 'kode_level';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = [];
}
