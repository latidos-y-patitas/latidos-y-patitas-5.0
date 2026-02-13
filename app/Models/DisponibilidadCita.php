<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisponibilidadCita extends Model
{
    protected $table = 'disponibilidad_citas';
    protected $primaryKey = 'id_disponibilidad';
    public $timestamps = false;
    
    protected $fillable = [
        'id_veterinario',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'estado'
    ];
    
    // Relaciones
    public function veterinario()
    {
        return $this->belongsTo(Veterinario::class, 'id_veterinario', 'id_veterinario');
    }
    
    public function cita()
    {
        return $this->hasOne(Cita::class, 'id_disponibilidad', 'id_disponibilidad');
    }
}