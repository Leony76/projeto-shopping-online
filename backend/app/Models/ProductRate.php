<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Product;

class ProductRate extends Model
{   
    protected $table = 'product_rating';

    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
    ];

    public function products() {
        return $this->belongsTo(Product::class);
    }

    public function users() {
        return $this->belongsTo(User::class);
    }
}
