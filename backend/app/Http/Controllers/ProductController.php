<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use App\Models\Order;

class ProductController extends Controller
{
    public function index(): JsonResponse {
        return response()->json([
            'products' => Product::all()
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|min:2|max:50',
            'category' => 'required|string',
            'description' => 'required|string|min:2|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp',
            'amount' => 'required|integer|min:1',
            'price' => 'required|numeric|min:1',
        ]);

        $path = $request->file('image')->store('products', 'public');

        Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
            'datePutToSale' => now(),
            'amount' => (int) $request->amount,
            'price' => (float) $request->price,
            'image' => $path,
        ]);

        return response()->json([
            'message' => 'Produto adicionado com sucesso!',
            'type' => 'success',
        ]);
    }

    public function create(Request $request) {
        $request->validate([
            'id' => 'required|integer',
            'amount' => 'required|integer',
        ]);

        $user = auth()->user();

        $product = Product::where('id', $request->id)->first();

        if ($user->wallet < ($product->price * $request->amount)) {
            return response()->json([
                'message' => 'Saldo insuficente!',
                'type' => 'error'
            ], 400);
        }

        if ($product->amount < 1) {
            return response()->json([
                'message' => 'Produto fora de estoque!',
                'type' => 'error'
            ], 400);
        }
 
        Order::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => $request->amount,
            'unit_price' => $product->price,
            'total_price' => ($product->price * $request->amount),
        ]);

        $product->amount -= $request->amount;
        $user->wallet -= ($product->price * $request->amount);

        $product->save();
        $user->save();

        return response()->json([
            'message' => 'Produto comprado com sucesso!',
            'type' => 'success',
            'product_bought' => $product,
            'wallet' => $user->wallet,
        ], 200);
    }

   public function list() {
        $user = auth()->user();

        $productIds = $user->orders()->pluck('product_id');
        $userOrders = $user->orders()->get();

        $products = Product::whereIn('id', $productIds)->withTrashed()->get();

        return response()->json([
            'products' => $products,
            'transactions' => $userOrders,
        ]);
    }

    public function destroy(int $id) {
        Product::destroy($id);

        return response()->json([
            'message' => 'Produto removido com sucesso',
            'type' => 'success',
        ], 200);
    }

    public function update(int $id, Request $request) {
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

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->update([
                'image' => $path
            ]);
        }

        return response()->json([
            'message' => 'Produto editado com sucesso',
            'type' => 'success',
            'product' => $product,
        ], 200);
    }
}
