<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    protected $table = 'metodos_pago';
    protected $primaryKey = 'id_metodo_pago';
    public $timestamps = false;
    
    protected $fillable = [
        'nombre'
    ];
    
    // Relaciones
    public function pagos()
    {
        return $this->hasMany(Pago::class, 'id_metodo_pago', 'id_metodo_pago');
    }
}