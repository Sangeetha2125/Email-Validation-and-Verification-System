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
        Schema::create('lists_results', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('list_id');
            $table->text('valid_path')->nullable();
            $table->integer('valid_count')->nullable();
            $table->text('invalid_path')->nullable();
            $table->integer('invalid_count')->nullable();
            $table->text('domain_path')->nullable();
            $table->integer('domain_count')->nullable();
            $table->text('spam_path')->nullable();
            $table->integer('spam_count')->nullable();
            $table->timestamps();
            $table->foreign('list_id')->references('id')->on('lists')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lists_results');
    }
};
