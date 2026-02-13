<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Veterinario extends Model
{
    protected $table = 'veterinarios';
    protected $primaryKey = 'id_veterinario';
    public $timestamps = false;
    
    protected $fillable = [
        'id_usuario',
        'especialidad'
    ];
    
    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
    
    public function disponibilidades()
    {
        return $this->hasMany(DisponibilidadCita::class, 'id_veterinario', 'id_veterinario');
    }
    
    public function registrosClinicos()
    {
        return $this->hasMany(RegistroClinico::class, 'id_veterinario', 'id_veterinario');
    }
}