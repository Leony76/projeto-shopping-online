<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'image' => $this->faker->imageUrl(640, 480, 'products', true),
            'name' => $this->faker->words(3, true),
            'amount' => $this->faker->numberBetween(1, 100),
            'category' => $this->faker->randomElement([
                'Artesanal',
                'Cozinha',
                'Limpeza',
            ]),
            'datePutToSale' => $this->faker->date(),
            'description' => $this->faker->paragraph(4),
            'price' => $this->faker->randomFloat(2, 5, 500),
        ];
    }
}
