<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyPk extends Model
{
    protected $table = 'pk';
    protected $primaryKey = 'id_pk';
    public $timestamps = false;
    protected $guarded = [];
}
