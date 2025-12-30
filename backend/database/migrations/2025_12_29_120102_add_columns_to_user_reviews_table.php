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
        Schema::table('user_reviews', function (Blueprint $table) {
            $table->string('username')->nullable();
            $table->integer('likes')->default(0);
            $table->integer('dislikes')->default(0);
            $table->unsignedTinyInteger('rate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_reviews', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->dropColumn('likes');
            $table->dropColumn('dislikes');
            $table->dropColumn('rate');
        });
    }
};
