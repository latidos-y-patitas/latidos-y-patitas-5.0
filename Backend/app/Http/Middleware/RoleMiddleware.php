<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $roles)
    {
        $user = $request->attributes->get('user');
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        
        $allowed = array_map('trim', explode('|', $roles));
        $nombreRol = $user->rol ? $user->rol->nombre_rol : null;
        
        if (!$nombreRol || !in_array($nombreRol, $allowed, true)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        
        return $next($request);
    }
}
