<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('product_suggests', function (Blueprint $table) {
            $table->boolean('accepted')->default(false);
            $table->boolean('denied')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_suggests', function (Blueprint $table) {
            $table->dropColumn('accepted');
            $table->dropColumn('denied');
        });
    }
};
