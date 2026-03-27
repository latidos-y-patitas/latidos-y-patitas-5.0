<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VeterinarioController;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\DisponibilidadCitaController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\HistoriaClinicaController;
use App\Http\Controllers\RegistroClinicoController;
use App\Http\Controllers\SolicitudAdopcionController;
use App\Http\Controllers\MetodoPagoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ContactoMensajeController;

// Auth
Route::post('register', [RegistroController::class, 'store']);
Route::post('login',    [AuthController::class, 'login']);
Route::post('logout',   [AuthController::class, 'logout']);

// Catálogos (antes de apiResource para evitar conflicto con show())
Route::get('especies', [MascotaController::class, 'especies']);
Route::get('sexos',    [MascotaController::class, 'sexos']);

// Mascotas — rutas estáticas PRIMERO, luego el resource
// PUT con multipart/form-data no funciona en PHP, usamos POST + _method
Route::post('mascotas/{id}/adoptar', [SolicitudAdopcionController::class, 'adoptar']);
Route::post('mascotas/{id}',         [MascotaController::class, 'update']);   // 👈 POST spoofing para update con archivos
Route::apiResource('mascotas', MascotaController::class)->except(['update']); // 👈 excluye PUT/PATCH nativos

// Solicitudes de adopción
Route::post('solicitudes-adopcion/{id}/aprobar',  [SolicitudAdopcionController::class, 'aprobar']);
Route::post('solicitudes-adopcion/{id}/rechazar', [SolicitudAdopcionController::class, 'rechazar']);
Route::patch('solicitudes-adopcion/{id}/estado',  [SolicitudAdopcionController::class, 'updateEstado']);
Route::get('admin/solicitudes-adopcion/pendientes', [SolicitudAdopcionController::class, 'pendientes']);
Route::apiResource('solicitudes-adopcion', SolicitudAdopcionController::class);

// Citas — rutas específicas primero
Route::get('admin/citas',                                    [CitaController::class, 'adminIndex']);
Route::get('admin/citas-activas',                            [CitaController::class, 'activasAhora']);
Route::get('usuarios/{userId}/citas/pendientes',             [CitaController::class, 'pendientesPorCliente']);
Route::get('usuarios/{userId}/citas',                        [CitaController::class, 'porCliente']);
Route::get('veterinarios/{vetId}/citas/pendientes',          [CitaController::class, 'pendientesPorVeterinario']);
Route::get('veterinarios/{vetId}/citas',                     [CitaController::class, 'porVeterinario']);
Route::post('veterinarios/{vetId}/citas/{id}/confirmar',     [CitaController::class, 'confirmarPorVeterinario']);
Route::post('veterinarios/{vetId}/citas/{id}/cancelar',      [CitaController::class, 'cancelarPorVeterinario']);
Route::post('citas/solicitar',                               [CitaController::class, 'solicitar']);
Route::post('citas/{id}/confirmar',                          [CitaController::class, 'confirmar']);
Route::post('citas/{id}/cancelar',                           [CitaController::class, 'cancelar']);
Route::patch('citas/{id}/estado',                            [CitaController::class, 'cambiarEstado']);
Route::apiResource('citas', CitaController::class);

// Disponibilidad
Route::patch('disponibilidad-citas/{id}/estado', [DisponibilidadCitaController::class, 'cambiarEstado']);
Route::apiResource('disponibilidad-citas', DisponibilidadCitaController::class);

// Contacto
Route::get('admin/contacto-mensajes',              [ContactoMensajeController::class, 'index']);
Route::patch('admin/contacto-mensajes/{id}/estado',[ContactoMensajeController::class, 'updateEstado']);
Route::post('contacto',                            [ContactoMensajeController::class, 'store']);

// Resto de recursos
Route::apiResource('roles',              RolController::class);
Route::apiResource('usuarios',           UsuarioController::class);
Route::apiResource('registro',           RegistroController::class)->only(['store']);
Route::apiResource('veterinarios',       VeterinarioController::class);
Route::apiResource('historias-clinicas', HistoriaClinicaController::class);
Route::apiResource('registros-clinicos', RegistroClinicoController::class);
Route::apiResource('metodos-pago',       MetodoPagoController::class);
Route::apiResource('pagos',              PagoController::class);