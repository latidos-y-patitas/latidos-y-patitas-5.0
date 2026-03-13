<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->attributes->get('user');
        $user->load('rol');
        $mascotas = $user->mascotas()->get();
        $citas = $user->citas()->with('disponibilidad.veterinario')->get();
        
        return response()->json([
            'user' => $user,
            'mascotas' => $mascotas,
            'citas' => $citas,
        ]);
    }
    
    public function update(Request $request)
    {
        $user = $request->attributes->get('user');
        
        $data = $request->only(['nombre','telefono']);
        $user->update($data);
        
        return response()->json($user);
    }
}
