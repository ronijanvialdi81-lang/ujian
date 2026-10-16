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
        Schema::create('rekap_nilais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_ujian_id')->constrained('jadwal_ujians')->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('users')->cascadeOnDelete();
            $table->integer('jumlah_benar')->default(0);
            $table->integer('jumlah_salah')->default(0);
            $table->decimal('nilai_akhir', 5, 2)->default(0);
            $table->string('status', 20)->default('tuntas'); // tuntas, remedial
            $table->dateTime('waktu_selesai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekap_nilais');
    }
};
