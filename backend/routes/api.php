<?php 
  use App\Http\Controllers;
  use Illuminate\Http\Request;
  use Illuminate\Support\Facades\Auth;
  use Illuminate\Support\Facades\Route;

  use App\Models\User;
  use App\Models\Product;
  use App\Models\UserReview;

  use App\Http\Controllers\UserController;
  use App\Http\Controllers\ProductController;
  use App\Http\Controllers\UserReviewController;
  use App\Http\Controllers\AddSuggestionsController;
  use App\Http\Controllers\AuthController;


  
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
    
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
  });

  
  Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        return response()->json(['message' => 'Credenciais inválidas'], 401);
    }

    $token = $user->createToken('access-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
});


  Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
  Route::post('/reset-password', [AuthController::class, 'resetPassword']);

  Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
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
    Route::post('/product-suggest/{id}', [ProductController::class, 'productSuggest']);
    Route::get('/suggested-products',[ProductController::class, 'suggestedProducts']);
    Route::patch('/suggested-product-answer/{id}', [ProductController::class, 'suggestedProductAnswer']);
    Route::get('/accepted-suggested-products', [ProductController::class, 'acceptedSuggestedProducts']);
    Route::post('/add-suggested-product/{id}', [ProductController::class, 'addSuggestedProduct']);

    Route::post('/add-suggestion', [AddSuggestionsController::class, 'addSuggestion']);
    Route::get('/add-suggestions', [AddSuggestionsController::class, 'listAddSuggestions']);
    Route::patch('/add-suggestion-decision/{id}', [AddSuggestionsController::class, 'updateAddSuggestion']);

    Route::post('/product-rating/{id}', [ProductController::class, 'updateRating']);
    Route::post('/user-review/{id}', [UserReviewController::class, 'store']);
    Route::get('/users-reviews', [UserReviewController::class, 'index']);
    Route::post('/like-dislike-comment/{id}', [UserReviewController::class, 'updateLikeDislike']);
    Route::get('/users-current-reactions', [UserReviewController::class, 'usersCurrentReactions']);

    Route::patch('/user/update-data', [UserController::class, 'update']);
    Route::post('/passwordCheck', [UserController::class, 'checkPassword']);
  });
?>
  
  