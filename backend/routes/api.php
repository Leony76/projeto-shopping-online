<?php 
  use App\Models\User;
  use App\Models\Product;
  use App\Http\Controllers;
  use Illuminate\Http\Request;
  use Illuminate\Support\Facades\Auth;
  use Illuminate\Support\Facades\Route;
  use App\Http\Controllers\UserController;
  use App\Http\Controllers\ProductController;

  Route::get('/test-session', function () {
    session(['teste' => 'ok']);
    return session('teste');
  });
  
  Route::post('/register', function (Request $request) {
    $data = $request->validate([
      'name' => 'required|string',
      'email' => 'required|email|unique:users',
      'password' => 'required|min:6'
    ]);
    
    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'password' => bcrypt($data['password']),
    ]);
    
    Auth::login($user);
    
    return response()->json($user);
  });
  
  Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
      'email' => 'required|email',
      'password' => 'required'
    ]);
    
    if (!Auth::attempt($credentials)) {
      return response()->json(['message' => 'Credenciais inválidas'], 401);
    }
    
    return response()->json(Auth::user());
  });
  
  Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
  });
  
  Route::post('/logout', function () {
    Auth::logout();
    return response()->json(['message' => 'Logout realizado']);
  });
  
  /* Main Routes */

  Route::get('/products', [ProductController::class, 'index']);
  Route::post('/admin/add-product', [ProductController::class, 'store']);
  Route::post('/buy-product', [ProductController::class, 'create']);
  Route::get('/user-products', [ProductController::class, 'list']);
  Route::delete('/product/{id}', [ProductController::class, 'destroy']);
  Route::patch('/product/{id}', [ProductController::class, 'update']);
  Route::post('/cart-products', [ProductController::class, 'storeCartProducts']);
  Route::post('/product-rating/{id}', [ProductController::class, 'updateRating']);

  Route::patch('/user/update-data', [UserController::class, 'update']);
  Route::post('/passwordCheck', [UserController::class, 'checkPassword']);
?>
  
  