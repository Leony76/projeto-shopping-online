<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'amount',
        'image',
    ];

    public function users() {
        return $this->belongsToMany(User::class, 'product_user')->withPivot('amount')->withTimeStamps();
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }
}