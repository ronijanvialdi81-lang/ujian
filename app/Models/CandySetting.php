<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandySetting extends Model
{
    protected $table = 'setting';
    protected $primaryKey = 'id_setting';
    public $timestamps = false;
    protected $guarded = [];
}
