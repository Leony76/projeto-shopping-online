<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    public function update(Request $request) {
        $data = $request->validate([
            'name' => 'sometimes|required|string|min:2|max:100',
            'email' => 'sometimes|required|email|min:7|max:50',
            'phone' => 'sometimes|required|string|min:14|max:15',
            'birthday' => 'sometimes|required|date|size:10',

            'password' => 'sometimes|required|string|min:6|max:50',
            'recovery_email' => 'sometimes|required|email|min:7|max:100', 
            'recovery_phone' => 'sometimes|required|string|min:14|max:15',
            
            'neighborhood' => 'sometimes|required|string|min:2|max:100',
            'public_place' => 'sometimes|required|string|min:2|max:100',
            'home_number' => 'sometimes|required|string|min:1|max:5',
            'complement' => 'sometimes|required|string|min:2|max:100',
            'country' => 'sometimes|required|string|min:2|max:50',
            'zip_code' => 'sometimes|required|string|size:9',
            'state' => 'sometimes|required|string|min:2|max:50',
            'city' => 'sometimes|required|string|min:2|max:50',
        ] , [
            'name.min' => 'O nome deve ter no mínimo 2 caractéres',
            'name.max' => 'O nome deve ter no máximo 50 caractéres',

            'email.min' => 'O e-mail deve ter no mínimo 7 caractéres',
            'email.max' => 'O e-mail deve ter no máximo 50 caractéres',

            'phone.min' => 'O telefone deve ter no mínimo 14 caractéres',
            'phone.max' => 'O telefone deve ter no máximo 15 caractéres',
           
            'password.min' => 'A senha deve ter no mínimo 2 caractéres',
            'password.max' => 'A senha deve ter no máximo 50 caractéres',
            
            'recovery_email.min' => 'O e-mail de recuperação deve ter no mínimo 7 caractéres',
            'recovery_email.max' => 'O e-mail de recuperação deve ter no máximo 50 caractéres',
            
            'recovery_phone.min' => 'O telefone de recuperação deve ter no mínimo 14 caractéres',
            'recovery_phone.max' => 'O telefone de recuperação deve ter no máximo 15 caractéres',
            
            'neighborhood.min' => 'O bairro deve ter no mínimo 2 caractéres',
            'neighborhood.max' => 'O bairro deve ter no máximo 50 caractéres',
            
            'public_place.min' => 'O logradouro deve ter no mínimo 2 caractéres',
            'public_place.max' => 'O logradouro deve ter no máximo 50 caractéres',
            
            'home_number.min' => 'O número de residência deve ter no mínimo 1 caractéres',
            'home_number.max' => 'O número de residência deve ter no máximo 5 caractéres',
            
            'complement.min' => 'O complemento deve ter no mínimo 2 caractéres',
            'complement.max' => 'O complemento deve ter no máximo 50 caractéres',
            
            'state.min' => 'O estado deve ter no mínimo 2 caractéres',
            'state.max' => 'O estado deve ter no máximo 50 caractéres',
            
            'city.min' => 'A cidade deve ter no mínimo 2 caractéres',
            'city.max' => 'A cidade deve ter no máximo 50 caractéres',
            
            'country.min' => 'O país deve ter no mínimo 2 caractéres',
            'country.max' => 'O país deve ter no máximo 50 caractéres',
                        
            'birthday.size' => 'A data de nascimento deve ter exatos 10 caractéres',
            'zip_code.size' => 'O CEP deve ter exatos 9 caractéres',
        ]);

        $user = auth()->user();

        if (isset($data['password']) && Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'A senha não pode ser a mesma da atual'
            ],422);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Dado atualizado com sucesso!',
            'type' => 'success',
            'updated_data' => $user,
        ], 200);
    }

    public function checkPassword(Request $request) {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'invalid credentials'
            ], 400);
        }

        return response()->json([
            'type' => 'success',
        ], 200);
    }
}
