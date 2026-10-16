import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap, LogIn, Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-slate-100">
            <Head title="CBT Ujian Sekolah - Portal Resmi" />

            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30">
                    <GraduationCap className="size-11" />
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                    <Sparkles className="size-3.5 text-amber-300" />
                    <span>CBT Ujian Sekolah Modern</span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                    Sistem Ujian Berbasis Komputer
                </h1>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Platform evaluasi dan ujian sekolah terpadu untuk Administrator, Guru, dan Siswa.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
                        >
                            <span>Buka Dashboard</span>
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
                        >
                            <LogIn className="size-4" />
                            <span>Masuk ke Portal Ujian</span>
                        </Link>
                    )}
                </div>

                <p className="mt-8 text-xs text-slate-500">
                    Akun peserta dan guru dikelola oleh administrator sekolah.
                </p>
            </div>
        </div>
    );
}
