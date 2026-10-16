<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyToken extends Model
{
    protected $table = 'token';
    protected $primaryKey = 'id_token';
    public $timestamps = false;
    protected $guarded = [];
}
