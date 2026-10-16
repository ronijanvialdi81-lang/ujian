<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandyKelas extends Model
{
    protected $table = 'kelas';
    protected $primaryKey = 'id_kelas';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = [];

    public function siswas()
    {
        return $this->hasMany(CandySiswa::class, 'id_kelas', 'id_kelas');
    }
}
