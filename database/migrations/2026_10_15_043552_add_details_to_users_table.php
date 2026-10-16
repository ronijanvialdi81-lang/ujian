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
            $table->foreignId('mata_pelajaran_id')->nullable()->after('role')->constrained('mata_pelajarans')->nullOnDelete();
            $table->foreignId('kelas_id')->nullable()->after('mata_pelajaran_id')->constrained('kelas')->nullOnDelete();
            $table->string('gender', 10)->nullable()->after('kelas_id'); // L, P
            $table->string('phone', 30)->nullable()->after('gender');
            $table->string('status', 20)->default('aktif')->after('phone'); // aktif, nonaktif
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['mata_pelajaran_id']);
            $table->dropForeign(['kelas_id']);
            $table->dropColumn(['mata_pelajaran_id', 'kelas_id', 'gender', 'phone', 'status']);
        });
    }
};
