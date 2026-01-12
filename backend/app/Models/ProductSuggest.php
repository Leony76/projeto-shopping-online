<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ProductSuggest extends Model
{
    protected $table = 'product_suggests';

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'description',
        'price',
        'image',
        'accepted',
        'denied',
        'for_sale',
    ];

    protected $appends = [
        'image_url'
    ];

    public function getImageUrlAttribute(): string {
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return asset('storage/' . $this->image);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
