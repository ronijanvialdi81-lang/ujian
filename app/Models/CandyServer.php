<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyServer extends Model
{
    protected $table = 'server';
    protected $primaryKey = 'kode_server';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = [];
}
