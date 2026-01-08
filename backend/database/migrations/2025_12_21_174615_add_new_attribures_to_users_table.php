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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->date('birthday')->nullable();

            $table->string('recovery_email')->nullable();
            $table->string('recovery_phone')->nullable();

            $table->string('public_place')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('home_number')->nullable();
            $table->string('complement')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone');
            $table->dropColumn('birthday');

            $table->dropColumn('recovery_email');
            $table->dropColumn('recovery_phone');

            $table->dropColumn('public_place');
            $table->dropColumn('zip_code');
            $table->dropColumn('home_number');
            $table->dropColumn('complement');
            $table->dropColumn('neighborhood');
            $table->dropColumn('city');
            $table->dropColumn('state');
            $table->dropColumn('country');
        });
    }
};
