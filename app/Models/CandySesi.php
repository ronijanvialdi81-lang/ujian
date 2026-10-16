<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandySesi extends Model
{
    protected $table = 'sesi';
    protected $primaryKey = 'kode_sesi';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = [];
}
