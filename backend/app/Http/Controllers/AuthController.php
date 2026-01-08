<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Mail\ResetPasswordMail;
use App\Models\User;

class AuthController extends Controller
{
    public function forgotPassword(Request $request) {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Se o e-mail existir, enviaremos o link.'
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => hash('sha256', $token),
                'created_at' => Carbon::now()
            ]
        );

        $url = config('app.frontend_url') . '/reset-password?' . http_build_query([
            'token' => $token,
            'email' => $user->email,
        ]);

        Mail::to($user->email)->send(new ResetPasswordMail($url));

        return response()->json([
            'message' => 'Se o e-mail existir, enviaremos o link.'
        ]);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed'
        ]);

        $email = urldecode($request->email);
        $token = urldecode($request->token);

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();


        if (!$record || !hash_equals($record->token, hash('sha256', $token))) {
            return response()->json([
                'message' => 'Token inválido ou expirado.'
            ], 400);
        }

        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Senha redefinida com sucesso.',
            'type' => 'success',
        ]);
    }
}
