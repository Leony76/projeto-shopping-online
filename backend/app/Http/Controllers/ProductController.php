<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller {
    public function index() {
        return Product::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'name'        => 'required|string',
            'category'    => 'required|string',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'image'       => 'required|image|mimes:jpg,jpeg,png,webp',
            'amount'      => 'required|integer|min:1',
        ]);

        $path = $request->file('image')->store('products', 'public');

        $product = Product::Create([
            'name'        => $request->name,
            'category'    => $request->category,
            'description' => $request->description,
            'price'       => $request->price,
            'amount'      => $request->amount, 
            'image'       => $path,
        ]);

        return response()->json([
            'message' => 'Produto adicionado com sucesso!',
            'type' => 'success',
            'product' => $product,
        ], 201);
    }

    public function buyProduct(Request $request) {
        $request->validate([
           'product_id' => 'required|exists:products,id',
           'product_amount_bought' => 'required|integer|min:1'
        ]);

        return DB::transaction(function() use ($request) {
            $user = User::lockForUpdate()->find(auth()->id());
            $product = Product::lockForUpdate()->findOrFail($request->product_id);
            
            if ($product->amount < 1) {
                return response()->json([
                    'message' => 'Produto fora de estoque!',
                    'type' => 'error'
                ], 400);
            }
    
            if ($user->wallet < ($product->price * $request->product_amount_bought)) {
                return response()->json([
                    'message' => 'Saldo Insuficiente',
                    'type' => 'error'
                ], 400);
            }

            if ($request->product_amount_bought > $product->amount) {
                return response()->json([
                    'message' => 'Não há no estoque a quantidade comprada!',
                    'type' => 'error'
                ], 400);
            }
    
            $user->wallet -= ($product->price * $request->product_amount_bought);
    
            $existing = $user->products()->where(
                'product_id', $product->id
            )->first();
    
            if ($existing) {
                $current_amount = $existing->pivot->amount;
    
                $user->products()->updateExistingPivot($product->id, [
                   'amount' => ($current_amount + $request->product_amount_bought),
                   'updated_at' => now()
                ]);
            } else {
                 $user->products()->attach($product->id, [
                    'amount' => $request->product_amount_bought,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
    
            $product->amount -= $request->product_amount_bought;
            
            $product_price_multiplied = ($product->price * $request->product_amount_bought);

            Order::create([
                'price' => $product_price_multiplied,
                'price_per_unit' => $product->price,
                'amount' => $request->product_amount_bought,
                'user_id' => $user->id,
                'product_id' => $product->id
            ]);
            
            $product->save();
            $user->save();
    
            return response()->json([
                'message' => 'Compra realizada com sucesso!',
                'type' => 'success',
                'wallet' => $user->wallet,
                'remaining_stock' => $product->amount,
                'product_amount_bought' => $request->product_amount_bought,
                'total_price' => $product_price_multiplied,
                'price_per_unit' => $product->price,
            ], 201);
        });
    }

    public function listUserProducts() {
        $user = auth()->user();
        $products = $user->products()->get();

        $result = $products->map(function ($product) use ($user) {
            $dates = $user->orders()->where(
                'product_id', $product->id
            )->orderBy(
                'created_at', 'desc'
            )->pluck(
                'created_at'
            );
            
            $prices = $user->orders()->where(
                'product_id', $product->id
            )->orderBy(
                'created_at', 'desc'
            )->pluck(
                'price'
            );

            $prices_per_unit = $user->orders()->where(
                'product_id', $product->id
            )->orderBy(
                'created_at', 'desc'
            )->pluck(
              'price_per_unit'  
            );

            $amouts = $user->orders()->where(
                'product_id', $product->id
            )->orderBy(
                'created_at', 'desc'
            )->pluck(
                'amount'
            );
                
            $product->purchase_dates = $dates;
            $product->prices = $prices;
            $product->prices_per_unit = $prices_per_unit;
            $product->amounts = $amouts;

            return $product;
        });

        return response()->json([
            'products' => $result
        ], 200);
    }
}