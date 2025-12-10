<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'price',
        'user_id',
        'product_id'
    ];

    public function users() {
        return $this->belongsTo(User::class);
    }

    public function products() {
        return $this->belongsTo(Product::class);
    }
}