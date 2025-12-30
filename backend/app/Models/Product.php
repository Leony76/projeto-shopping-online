<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\ProductRate;
use App\Models\UserReviews;

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
        'rating',
    ];

    protected $appends = ['image_url', 'user_rating'];

    public function getImageUrlAttribute() {
        return asset('storage/' . $this->image);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }

    public function ratings() {
        return $this->hasMany(ProductRate::class, 'product_id');
    }

    public function getUserRatingAttribute() {
        return $this->ratings->first()->rating ?? null;
    }

    public function productRate() {
        return $this->hasMany(ProductRate::class);
    }

    public function userReviews() {
        return $this->hasMany(UserReviews::class);
    }
}
