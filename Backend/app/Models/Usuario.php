<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'telefono',
        'id_rol'
    ];
    
    protected $hidden = [
        'password'
    ];
    
    // Relaciones
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }
    
    public function veterinario()
    {
        return $this->hasOne(Veterinario::class, 'id_usuario', 'id_usuario');
    }
    
    public function citas()
    {
        return $this->hasMany(Cita::class, 'id_cliente', 'id_usuario');
    }
    
    public function solicitudesAdopcion()
    {
        return $this->hasMany(SolicitudAdopcion::class, 'id_cliente', 'id_usuario');
    }
    
    public function mascotas()
    {
        return $this->hasMany(Mascota::class, 'id_admin', 'id_usuario');
    }
}