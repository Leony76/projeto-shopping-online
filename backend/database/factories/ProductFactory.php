<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $imagePath = Storage::disk('public')->put(
            'products',
            fake()->image()
        );

        return [
            'image' => $imagePath,
            'name' => fake()->words(3, true),
            'amount' => fake()->numberBetween(1, 100),
            'category' => fake()->randomElement([
                'Artesanal',
                'Cozinha',
                'Limpeza',
                'Eletrônico',
                'Móveis',
            ]),
            'description' => fake()->paragraph(4),
            'price' => fake()->randomFloat(2, 5, 500),
            'datePutToSale' => now(),
            'active' => 1,
        ];
    }
}
