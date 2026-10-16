import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, GraduationCap, Lock, LogIn, ShieldAlert, Sparkles, User, Users } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    login: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        login: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Quick fill for testing different roles
    const setCredentials = (login: string, pass: string) => {
        setData((prev) => ({
            ...prev,
            login,
            password: pass,
        }));
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white">
            <Head title="Login CBT - Sistem Ujian Sekolah" />

            <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Panel: Information & Branding */}
                    <div className="relative flex flex-col justify-between overflow-hidden p-8 sm:p-12 lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white">
                        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-md">
                                <Sparkles className="size-3.5 text-amber-300" />
                                <span>Tahun Ajaran 2026/2027</span>
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-lg">
                                    <GraduationCap className="size-7" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">CBT Ujian Sekolah</h1>
                                    <p className="text-xs text-indigo-100 font-medium">Computer Based Test System</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                                    Sistem Evaluasi & Ujian Sekolah Modern
                                </h2>
                                <p className="text-sm text-indigo-100/90 leading-relaxed">
                                    Portal terintegrasi untuk Administrator, Guru pembuat soal, serta Siswa peserta ujian berbasis komputer.
                                </p>
                            </div>
                        </div>

                        {/* Quick Demo Access Bar */}
                        <div className="relative z-10 mt-10 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-2.5">
                                Akses Cepat Akun Demo (Klik untuk Isi):
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCredentials('admin', 'password')}
                                    className="group flex flex-col items-center rounded-xl bg-white/10 p-2.5 text-center transition hover:bg-white hover:text-indigo-950 focus:outline-none"
                                >
                                    <ShieldAlert className="size-4 mb-1 text-amber-300 group-hover:text-indigo-600" />
                                    <span className="text-xs font-bold">Admin</span>
                                    <span className="text-[10px] opacity-75">admin</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCredentials('guru', 'password')}
                                    className="group flex flex-col items-center rounded-xl bg-white/10 p-2.5 text-center transition hover:bg-white hover:text-indigo-950 focus:outline-none"
                                >
                                    <Users className="size-4 mb-1 text-emerald-300 group-hover:text-indigo-600" />
                                    <span className="text-xs font-bold">Guru</span>
                                    <span className="text-[10px] opacity-75">guru</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCredentials('siswa', 'password')}
                                    className="group flex flex-col items-center rounded-xl bg-white/10 p-2.5 text-center transition hover:bg-white hover:text-indigo-950 focus:outline-none"
                                >
                                    <GraduationCap className="size-4 mb-1 text-cyan-300 group-hover:text-indigo-600" />
                                    <span className="text-xs font-bold">Siswa</span>
                                    <span className="text-[10px] opacity-75">siswa</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 text-xs text-indigo-200">
                            &copy; {new Date().getFullYear()} CBT Ujian Sekolah. Seluruh hak cipta dilindungi.
                        </div>
                    </div>

                    {/* Right Panel: Login Form */}
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7 bg-slate-900/90">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Masuk ke Portal</h3>
                                <p className="mt-1.5 text-sm text-slate-400">
                                    Silakan masukkan Email atau Username/NISN/NIP dan kata sandi Anda.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Login field (Email / Username / NISN) */}
                                <div className="space-y-2">
                                    <Label htmlFor="login" className="text-xs font-semibold text-slate-300">
                                        Email / Username / NISN / NIP
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                            <User className="size-4" />
                                        </div>
                                        <Input
                                            id="login"
                                            type="text"
                                            required
                                            autoFocus
                                            autoComplete="username"
                                            value={data.login}
                                            onChange={(e) => setData('login', e.target.value)}
                                            placeholder="admin, guru, siswa, atau email"
                                            className="h-11 border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <InputError message={errors.login} className="text-red-400 text-xs" />
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                                            Kata Sandi
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                            <Lock className="size-4" />
                                        </div>
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Masukkan kata sandi"
                                            className="h-11 border-slate-700 bg-slate-800/80 pl-10 pr-10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white transition"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="text-red-400 text-xs" />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center space-x-2.5">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData('remember', checked === true)}
                                            className="border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                        <Label htmlFor="remember" className="text-xs text-slate-300 cursor-pointer">
                                            Ingat sesi saya
                                        </Label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            <LogIn className="size-4" />
                                            <span>Masuk ke Sistem</span>
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Help Footer */}
                            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5 text-center text-xs text-slate-400">
                                Mengalami kendala saat login? Silakan hubungi proktor ruang atau operator administrator sekolah.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
