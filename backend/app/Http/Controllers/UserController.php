<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function userData() {
        return response()->json(auth()->user()); 
    }

    public function updateData(Request $request) {
        $data = $request->validate([
            'username' => 'nullable|string|min:1|max:50',
            'email' => 'nullable|string|min:3|max:50',
            'phone' => 'nullable|string|min:10|max:15',
            'birthday' => 'nullable|string|min:10|max:10'
        ] , [
            'username.min' => 'O nome deve ter pelo menos 1 caractere.',
            'username.max' => 'O nome deve ter no máximo 50 caracteres.',

            'email.min' => 'O e-mail deve ter pelo menos 3 caracteres.',
            'email.max' => 'O e-mail deve ter no máximo 50 caracteres.',

            'phone.max' => 'O telefone deve ter no máximo 14 caracteres, podendo incluir parênteses ")" ou hífens "-"',
            'phone.min' => 'O telefone deve ter no mínimo 11 caracteres, podendo incluir parênteses ")" ou hífens "-"',

            'birthday.min' => 'A data deve ter exatamente 10 caracteres (dd/mm/aaaa).',
            'birthday.max' => 'A data deve ter exatamente 10 caracteres (dd/mm/aaaa).',
        ]);

        $update = [];

        if (!empty($data['username'])) $update['name'] = $data['username'];
        if (!empty($data['email'])) $update['email'] = $data['email'];
        if (!empty($data['phone'])) $update['phone'] = $data['phone'];
        if (!empty($data['birthday'])) $update['birthday'] = $data['birthday'];

        if (empty($update)) {
            return response()->json([
                'message' => 'Nada a atualizar!',
                'type' => 'alert',
            ], 400);
        }
        
        $user = auth()->user();
        $user->update($update);

        return response()->json([
            'message' => 'Dado atualizado com sucesso!',
            'type' => 'success',
            'user_new_data' => $user,
        ], 200);
    }

    public function verifyPasswordBeforeUpdate(Request $request) {
        $data = $request->validate([
            'password' => 'required|string|min:6'
        ] , [
            'password.min' => 'A senha atual deve ter no mínimo 6 caractéres'
        ]);

        $user = auth()->user();

        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => 'password' 
            ], 200);
        } else {
            return response()->json([
                'message' => 'Senha inválida, tente novamente',
                'type' => 'error',
            ], 400);
        }
    }

    public function updatePassword(Request $request) {
        $data = $request->validate([
            'new_password' => 'required|string|min:6'
        ] , [
            'new_password.min' => 'A nova senha deve ter no mínimo 6 caractéres'
        ]);

        $user = auth()->user();

        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'message' => 'A nova senha não pode ser a mesma da atual'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);        
        
        return response()->json([
            'message' => 'Sucesso ao atualizar senha',
            'type' => 'success',
        ], 200);
    }
}