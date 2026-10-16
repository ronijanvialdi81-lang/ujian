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
        Schema::create('bank_soals', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->string('judul');
            $table->foreignId('mata_pelajaran_id')->nullable()->constrained('mata_pelajarans')->nullOnDelete();
            $table->foreignId('guru_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tingkat', 10)->default('10');
            $table->integer('jumlah_pg')->default(40);
            $table->integer('jumlah_esai')->default(5);
            $table->integer('durasi_menit')->default(90);
            $table->string('status', 20)->default('aktif'); // draft, aktif, arsip
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_soals');
    }
};
