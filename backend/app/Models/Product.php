<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'image',
        'name',
        'amount',
        'category',
        'datePutToSale',
        'description',
        'price',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        return asset('storage/' . $this->image);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
