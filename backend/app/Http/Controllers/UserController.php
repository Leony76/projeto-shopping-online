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
        $rules = [
            'username'          => 'sometimes|required|string|min:1|max:50',
            'email'             => 'sometimes|required|string|min:3|max:50',
            'phone'             => 'sometimes|required|string|min:10|max:15',
            'birthday'          => 'sometimes|required|string|size:10',

            'public_place'      => 'sometimes|required|string|min:2|max:100',
            'zip_code'          => 'sometimes|required|string|size:8',
            'residence_number'  => 'sometimes|required|string|min:1|max:10',
            'complement'        => 'sometimes|required|string|min:1|max:50',
            'neighborhood'      => 'sometimes|required|string|min:2|max:50',
            'city'              => 'sometimes|required|string|min:2|max:50',
            'state'             => 'sometimes|required|string|min:2|max:50',
            'country'           => 'sometimes|required|string|min:2|max:50',
        ];

        $messages = [
            'username.min' => 'O nome deve ter pelo menos 1 caractere.',
            'username.max' => 'O nome deve ter no máximo 50 caracteres.',

            'email.min' => 'O e-mail deve ter pelo menos 3 caracteres.',
            'email.max' => 'O e-mail deve ter no máximo 50 caracteres.',

            'phone.min' => 'O telefone deve ter no mínimo 11 caracteres.',
            'phone.max' => 'O telefone deve ter no máximo 14 caracteres.',

            'birthday.size' => 'A data deve ter exatamente 10 caracteres (dd/mm/aaaa).',

            'public_place.min' => 'O Logradouro deve ter no mínimo 2 caractéres.',
            'public_place.max' => 'O Logradouro deve ter no máximo 100 caractéres.',

            'zip_code' => 'O CEP deve ter exatamente 8 caractéres.',

            'residence_number.min' => 'O número de residência deve ter no mínimo 1 caractére.',
            'residence_number.max' => 'O número de residência deve ter no máximo 10 caractéres.',

            'complement.min' => 'O complemento deve ter no mínimo 1 caractére.',
            'complement.max' => 'O complemento deve ter no máximo 50 caractéres.',

            'neighborhood.min' => 'O bairro deve ter no mínimo 2 caractéres.',
            'neighborhood.max' => 'O bairro deve ter no máximo 50 caractéres.',

            'city.min' => 'A cidade deve ter no mínimo 2 caractéres.',
            'city.max' => 'A cidade deve ter no máximo 50 caractéres.',

            'state.min' => 'O estado deve ter no mínimo 2 caractéres.',
            'state.max' => 'O estado deve ter no máximo 50 caractéres.',

            'country.min' => 'O país deve ter no mínimo 2 caractéres.',
            'country.max' => 'O país deve ter no máximo 50 caractéres.',

            'username.required' => 'O campo de nome de usuário deve ser preenchido.',         
            'email.required' => 'O campo de e-mail deve ser preenchido.',            
            'phone.required' => 'O campo de telefone deve ser preenchido.',           
            'birthday.required' => 'O campo de data de nascimento deve ser preenchido.',         
            'public_place.required' => 'O campo de logradouro deve ser preenchido.',     
            'zip_code.required' => 'O campo de deve ser preenchido.',         
            'residence_number.required' => 'O campo de número de residência deve ser preenchido.', 
            'complement.required' => 'O campo de complemento deve ser preenchido.',       
            'neighborhood.required' => 'O campo de bairro deve ser preenchido.',     
            'city.required' => 'O campo de cidade deve ser preenchido.',             
            'state.required' => 'O campo de estado deve ser preenchido.',           
            'country.required' => 'O campo de país deve ser preenchido.',          
        ];

        $field = collect($request->all())->keys() ->first(
            fn ($key) => array_key_exists($key, $rules)
        );

        if (!$field) {
            return response()->json([
                'message' => 'Campo inválido para atualização',
                'type' => 'error',
            ], 400);
        }

        $validated = $request->validate([
            $field => $rules[$field]
        ], $messages);

        if ($field === 'phone') {
            $validated[$field] = preg_replace('/\D/', '', $validated[$field]);
        }

        $columnMap = [
            'username' => 'name',
        ];

        $dbField = $columnMap[$field] ?? $field;

        $user = auth()->user();
        $user->update([
            $dbField => $validated[$field]
        ]);

        return response()->json([
            'message' => 'Dado atualizado com sucesso!',
            'type' => 'success',
            'update' => $validated[$field],
            'field'  => $dbField,
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

    public function updateRecoveryEmail(Request $request) {
        $data = $request->validate([
            'recovery_email' => 'required|string|min:3' 
        ]);

        $user = auth()->user();

        if ($user->email === $data['recovery_email']) {
            return response()->json([
                'message' => 'O novo e-mail de recuperação não pode ser o mesmo do principal'
            ], 400);
        }

        if ($user->recovery_email != null && ($user->recovery_email === $data['recovery_email'])) {
            return response()->json([
                'message' => 'O novo e-mail de recuperação não pode ser o mesmo do atual'
            ], 400);
        }

        $user->update([
            'recovery_email' => $data['recovery_email']
        ]);

        
        $is_null = is_null($user->recovery_email);
        $action = $is_null ? 'definido' : 'alterado';

        return response()->json([
            'message' => "E-mail de recuperação $action com sucesso!",
            'type' => 'success',
            'update' => $user->recovery_email
        ], 200);
    }

    public function updateRecoveryPhone(Request $request) {
        $request->validate([
            'recovery_phone' => 'required|string|min:11|max:15'
        ], [
            'recovery_phone.min' => 'O número de telefone deve ter no mínimo 11 caractéres'
        ]);

        $user = auth()->user();

        $normalized_recovery_phone = preg_replace('/\D/', '', $request->recovery_phone);

        if ($user->recovery_phone === $normalized_recovery_phone) {
            return response()->json([
                'message' => 'O novo telefone de recuperação não pode ser igual ao atual'
            ], 400);
        }

        if ($user->phone === $normalized_recovery_phone) {
            return response()->json([
                'message' => 'O telefone de recuperação não pode ser o mesmo do principal'
            ], 400);
        }

        $user->update([
            'recovery_phone' => $normalized_recovery_phone
        ]);

        $is_null = is_null($user->recovery_phone);
        $action = $is_null ? 'definido' : 'alterado';

        return response()->json([
            'message' => "Telefone de recuperação $action com sucesso!",
            'type' => 'success',
            'update' => $user->recovery_phone
        ], 200);
    }
}