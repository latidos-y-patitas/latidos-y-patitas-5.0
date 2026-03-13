<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaClinica extends Model
{
    protected $table = 'historias_clinicas';
    protected $primaryKey = 'id_historia';
    public $timestamps = false;
    
    protected $fillable = [
        'id_mascota',
        'fecha_apertura',
        'estado'
    ];
    
    // Relaciones
    public function mascota()
    {
        return $this->belongsTo(Mascota::class, 'id_mascota', 'id_mascota');
    }
    
    public function registros()
    {
        return $this->hasMany(RegistroClinico::class, 'id_historia', 'id_historia');
    }
}