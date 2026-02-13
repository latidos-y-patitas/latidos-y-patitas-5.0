<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'citas';
    protected $primaryKey = 'id_cita';
    public $timestamps = false;
    
    protected $fillable = [
        'id_cliente',
        'id_disponibilidad',
        'motivo',
        'estado'
    ];
    
    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Usuario::class, 'id_cliente', 'id_usuario');
    }
    
    public function disponibilidad()
    {
        return $this->belongsTo(DisponibilidadCita::class, 'id_disponibilidad', 'id_disponibilidad');
    }
    
    public function pago()
    {
        return $this->hasOne(Pago::class, 'id_cita', 'id_cita');
    }
}