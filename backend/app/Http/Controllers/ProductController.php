<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use App\Models\Order;
use Throwable;
use Illuminate\Support\Facades\Log;
use App\Models\ProductRate;
use App\Models\ProductSuggest;
use App\Models\User;
use App\Models\UserReview;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductController extends Controller
{
    public function index():JsonResponse {
        return response()->json([
            'products' => Product::query()
                ->withAvg('productRate', 'rating')
                ->withCount('productRate')
                ->withSum('orders', 'quantity')
                ->get()
        ]);
    }

    // public function store(Request $request):JsonResponse {
    //     $request->validate([
    //         'name' => 'required|string|min:2|max:50',
    //         'category' => 'required|string',
    //         'description' => 'required|string|min:2|max:255',
    //         'image' => 'required|image|mimes:jpg,jpeg,png,webp,gif',
    //         'amount' => 'required|integer|min:1',
    //         'price' => 'required|numeric|min:1',
    //     ]);

    //     $path = $request->file('image')->store('products', 'public');
    //     $uploaded = Cloudinary::upload(
    //         $request->file('image')->getRealPath(),
    //         ['folder' => 'products']
    //     );

    //     Product::create([
    //         'name' => $request->name,
    //         'category' => $request->category,
    //         'description' => $request->description,
    //         'datePutToSale' => now(),
    //         'amount' => (int) $request->amount,
    //         'price' => (float) $request->price,
    //         'image' => $uploaded->getSecurePath(),
    //     ]);

    //     return response()->json([
    //         'message' => 'Produto adicionado com sucesso!',
    //         'type' => 'success',
    //     ]);
    //     return response()->json([
    //         'cloudinary_env' => [
    //             'cloud_name' => config('cloudinary.cloud_name'),
    //             'key' => config('cloudinary.api_key') ? 'OK' : 'MISSING',
    //         ],
    //     ]);
    // }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|min:2|max:50',
            'category' => 'required|string',
            'description' => 'required|string|min:2|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'amount' => 'required|integer|min:1',
            'price' => 'required|numeric|min:1',
        ]);

        try {
            if (!$request->hasFile('image')) {
                return response()->json([
                    'message' => 'Imagem não recebida',
                ], 422);
            }

            $uploaded = Cloudinary::upload(
                $request->file('image')->getPathname(),
                ['folder' => 'products']
            );

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erro no upload',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function create(Request $request):JsonResponse {
        $data = $request->validate([
            'id' => 'required|integer',
            'amount' => 'required|integer',
        ]);

        $user = auth()->user();

        return DB::transaction(function () use ($data, $user){
            
            $product = Product::lockForUpdate()->findOrFail($data['id']);
            $user = User::lockForUpdate()->findOrFail($user->id);
            
            if ($product->amount < $data['amount']) {
                throw ValidationException::withMessages([
                    'stock' => 'Produto Fora de estoque'
                ]);
            }

            $totalPrice = ($product->price * $data['amount']);

            if ($user->wallet < $totalPrice) {
                throw ValidationException::withMessages([
                    'wallet' => 'Saldo insuficiente'
                ]);
            }    
        
            $product->decrement('amount', $data['amount']);
            $user->decrement('wallet', $totalPrice);

            Order::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'quantity' => $data['amount'],
                'unit_price' => $product->price,
                'total_price' => $totalPrice,
            ]);
               
            $product = Product::query()
                ->withAvg('productRate', 'rating')
                ->withCount('productRate')
                ->withSum('orders', 'quantity')
                ->findOrFail($product->id);
    
            return response()->json([
                'message' => 'Produto comprado com sucesso!',
                'type' => 'success',
                'product_bought' => $product,
                'wallet' => $user->wallet,
            ], 200);
        });
    }

    public function list():JsonResponse {
        $user = auth()->user();

        $productIds = $user->orders()->pluck('product_id');

        $products = Product::whereIn('id', $productIds)
            ->withTrashed()
            ->with([
                'ratings' => function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->select('id', 'product_id', 'rating');
                }
            ])
            ->get();

        $userOrders = $user->orders()->get();

        return response()->json([
            'products' => $products,
            'transactions' => $userOrders,
        ]);
    }


    public function destroy(int $id):JsonResponse {
        Product::destroy($id);

        return response()->json([
            'message' => 'Produto removido com sucesso',
            'type' => 'success',
        ], 200);
    }

    public function update(int $id, Request $request):JsonResponse {
        $product = Product::findOrFail($id);

        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'amount' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable',
        ]);

        unset($validate['image']);

        $product->update($validate);

        // if ($request->hasFile('image')) {
        //     $path = $request->file('image')->store('products', 'public');
        //     $product->update([
        //         'image' => $path
        //     ]);
        // }

        if ($request->hasFile('image')) {
            $uploaded = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'products']
            );

            $product->update([
                'image' => $uploaded->getSecurePath(),
            ]);
        }

        return response()->json([
            'message' => 'Produto editado com sucesso',
            'type' => 'success',
            'product' => $product,
        ], 200);
    }

    public function storeCartProducts(Request $request):JsonResponse {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.amount' => 'required|integer|min:1',
        ]);

        $user = auth()->user();

        $totalCartPrice = 0;

        foreach($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $totalCartPrice += $product->price * $item['amount'];
        }

        if ($user->wallet < $totalCartPrice) {
            throw ValidationException::withMessages([
                'wallet' => 'Saldo insuficiente para finalizar a compra'
            ]);
        }

        return DB::transaction(function () use ($data, $user) {
            $orderIds = [];

            foreach($data['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                $unitPrice = round($product->price, 2);
                $quantity = $item['amount'];
                $totalPrice = round(($unitPrice * $quantity), 2);

                if ($product->amount < $quantity) {
                    throw ValidationException::withMessages([
                        'stock' => "Estoque insuficiente para $product->name"
                    ]);
                }

                if ($user->wallet < $totalPrice) {
                    throw ValidationException::withMessages([
                        'wallet' => "Saldo insuficiente"
                    ]);
                }

                $product->decrement('amount', $quantity);
                $user->decrement('wallet', $totalPrice);

                $order = Order::create([
                    'user_id'     => $user->id,
                    'product_id'  => $product->id,
                    'quantity'    => $quantity,
                    'unit_price'  => $unitPrice,
                    'total_price' => $totalPrice,
                ]);

                $orderIds[] = $order->id;
            }

            $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))
                ->withAvg('productRate', 'rating')
                ->withCount('productRate')
                ->withSum('orders', 'quantity')
                ->get()
            ;

            return response()->json([
                'message' => 'Compra do carrinho efetuada com sucesso',
                'type'    => 'success',
                'products' => $products,
                'wallet'  => round($user->fresh()->wallet, 2),
            ], 201);
        });
    }

    public function updateRating(int $id, Request $request):JsonResponse {
        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        ProductRate::updateOrCreate([
            'product_id' => $id,
            'user_id' => auth()->id(),
        ],[
            'rating' => $data['rating'],
        ]);

        UserReview::where('product_id', $id)
            ->where('user_id', auth()->id())
            ->update([
                'rate' => $data['rating']
            ]);

        return response()->json([
            'message' => 'Produto avaliado',
            'type' => 'info'
        ], 200);
    }

    public function productSuggest(Request $request, int $userId):JsonResponse {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:png,jpeg,jpg,webp',
        ]);

        // $imagePath = $request->file('image')->store(
        //     'product_suggests',
        //     'public',
        // );

        $uploaded = Cloudinary::upload(
            $request->file('image')->getRealPath(),
            ['folder' => 'product_suggests']
        );

        
        $data['price'] = (float) $data['price'];
        // $data['image'] = $imagePath;
        $data['image'] = $uploaded->getSecurePath();
        $data['user_id'] = $userId;

        ProductSuggest::create($data);

        return response()->json([
            'message' => 'Sugestão de produto enviada com sucesso',
            'type' => 'success',
            'suggestion' => $data,
        ], 201);
    }

    public function suggestedProducts():JsonResponse {
        $suggestedProducts = ProductSuggest::with('user:id,name')->get();

        return response()->json([
            'suggested_products' => $suggestedProducts
        ]);
    }

    public function suggestedProductAnswer(int $id, Request $request):JsonResponse {
        $request->validate(['answer' => 'required|string']);

        $productSuggest = ProductSuggest::findOrFail($id);

        if ($request->answer === 'accepted') {
            $productSuggest->update(['accepted' => true]);
        } else {
            $productSuggest->update(['denied' => true]);
        }
        
        $responseAnswer = $request->answer === 'accept' ? 'aceita' : 'negada';

        return response()->json([
            'message' => "Sugestão de produto foi $responseAnswer",
            'type' => 'info'
        ]);
    }

    public function acceptedSuggestedProducts():JsonResponse {
        return response()->json([      
            'accepted_suggestions' => ProductSuggest::where('accepted', true)->with('user:id,name')->get()
        ]);
    }

    public function addSuggestedProduct(Request $request, int $id):JsonResponse {
        $data = $request->validate([
            'amount' => 'required|integer|min:1'
        ]);

        $suggestedProduct = ProductSuggest::findOrFail($id);

        $suggestedProduct->update(['for_sale' => true]);

        $newProduct = Product::create([
            'name' => $suggestedProduct->name,
            'category' => $suggestedProduct->category,
            'description' => $suggestedProduct->description,
            'datePutToSale' => now(),
            'amount' => (int) $data['amount'],
            'price' => (float) $suggestedProduct->price,
            'image' => $suggestedProduct->image,
        ]);

        return response()->json([
            'message' => 'Produto sugerido posto à venda com sucesso',
            'type' => 'success',
            'new_product' => $newProduct,
        ], 201);
    }
}
