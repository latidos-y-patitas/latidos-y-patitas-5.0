<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistroClinico extends Model
{
    protected $table = 'registros_clinicos';
    protected $primaryKey = 'id_registro';
    public $timestamps = false;
    
    protected $fillable = [
        'id_historia',
        'id_veterinario',
        'fecha',
        'diagnostico',
        'tratamiento',
        'observaciones',
        'peso',
        'temperatura'
    ];
    
    // Relaciones
    public function historiaClinica()
    {
        return $this->belongsTo(HistoriaClinica::class, 'id_historia', 'id_historia');
    }
    
    public function veterinario()
    {
        return $this->belongsTo(Veterinario::class, 'id_veterinario', 'id_veterinario');
    }
}