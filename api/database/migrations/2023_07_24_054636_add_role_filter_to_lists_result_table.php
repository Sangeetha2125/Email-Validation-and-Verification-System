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
        Schema::table('lists_results', function (Blueprint $table) {
            $table->text('role_path')->nullable()->after('spam_count');
            $table->integer('role_count')->nullable()->after('role_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lists_results', function (Blueprint $table) {
            $table->text('role_path')->nullable()->after('spam_count');
            $table->integer('role_count')->nullable()->after('role_path');
        });
    }
};
