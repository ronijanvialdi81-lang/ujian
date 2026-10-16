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
        Schema::create('jadwal_ujians', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ujian');
            $table->foreignId('bank_soal_id')->constrained('bank_soals')->cascadeOnDelete();
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->nullOnDelete();
            $table->dateTime('tanggal_mulai');
            $table->dateTime('tanggal_selesai');
            $table->integer('durasi_menit')->default(90);
            $table->string('token', 10);
            $table->string('status', 20)->default('akan_datang'); // akan_datang, berlangsung, selesai
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_ujians');
    }
};
