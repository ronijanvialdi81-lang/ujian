import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    Flag,
    HelpCircle,
    LayoutGrid,
    LogOut,
    Sparkles,
    Type,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuestionItem {
    id_soal: number;
    nomor: number;
    soal: string;
    jenis: 'pg' | 'esai';
    pilA?: string | null;
    pilB?: string | null;
    pilC?: string | null;
    pilD?: string | null;
    pilE?: string | null;
    file?: string | null;
    file1?: string | null;
    fileA?: string | null;
    fileB?: string | null;
    fileC?: string | null;
    fileD?: string | null;
    fileE?: string | null;
}

interface AnswerState {
    [id_soal: number]: {
        jawaban?: string | null;
        esai?: string | null;
        ragu?: boolean;
    };
}

interface KerjakanUjianProps {
    ujian: {
        id_ujian: number;
        nama: string;
        kode_ujian: string;
        mapel: string;
        lama_ujian: number;
        total_soal: number;
    };
    siswa: {
        id_siswa: number;
        nama: string;
        nis: string;
        nisn: string;
        kelas: string;
        ruang: string;
        sesi: string;
    };
    questions: QuestionItem[];
    initialAnswers: AnswerState;
    sisaDetik: number;
}

export default function KerjakanUjian({
    ujian,
    siswa,
    questions = [],
    initialAnswers = {},
    sisaDetik = 3600,
}: KerjakanUjianProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswerState>(initialAnswers);
    const [timeLeft, setTimeLeft] = useState(sisaDetik);
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [confirmFinishCheck, setConfirmFinishCheck] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
    const [filterMode, setFilterMode] = useState<'semua' | 'belum' | 'ragu' | 'dijawab'>('semua');

    const currentQuestion = questions[currentIndex] || questions[0];
    const currentAnswer = currentQuestion ? answers[currentQuestion.id_soal] : undefined;

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format seconds into HH:MM:SS
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Auto submit when time runs out
    const handleAutoSubmit = () => {
        router.post(`/siswa/ujian/${ujian.id_ujian}/selesai`);
    };

    // Save single answer to backend
    const saveAnswerToBackend = async (
        idSoal: number,
        jawaban: string | null,
        esai: string | null,
        ragu: boolean
    ) => {
        setSaveStatus('saving');
        try {
            await fetch(`/siswa/ujian/${ujian.id_ujian}/simpan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    id_soal: idSoal,
                    jawaban: jawaban,
                    esai: esai,
                    ragu: ragu,
                }),
            });
            setSaveStatus('saved');
        } catch (e) {
            console.error('Failed to auto-save answer:', e);
            setSaveStatus('saved');
        }
    };

    // Handle Option Selection (A, B, C, D, E)
    const handleSelectOption = (opsi: string) => {
        if (!currentQuestion) return;

        const prevAns = answers[currentQuestion.id_soal] || {};
        const isAlreadySelected = prevAns.jawaban === opsi;
        const newJawaban = isAlreadySelected ? null : opsi;

        const updated = {
            ...answers,
            [currentQuestion.id_soal]: {
                ...prevAns,
                jawaban: newJawaban,
            },
        };
        setAnswers(updated);
        saveAnswerToBackend(
            currentQuestion.id_soal,
            newJawaban,
            prevAns.esai || null,
            prevAns.ragu || false
        );
    };

    // Handle Essay Text Change
    const handleEssayChange = (text: string) => {
        if (!currentQuestion) return;

        const prevAns = answers[currentQuestion.id_soal] || {};
        const updated = {
            ...answers,
            [currentQuestion.id_soal]: {
                ...prevAns,
                esai: text,
            },
        };
        setAnswers(updated);
        saveAnswerToBackend(
            currentQuestion.id_soal,
            prevAns.jawaban || null,
            text,
            prevAns.ragu || false
        );
    };

    // Handle Ragu-Ragu Toggle
    const handleToggleRagu = () => {
        if (!currentQuestion) return;

        const prevAns = answers[currentQuestion.id_soal] || {};
        const newRagu = !prevAns.ragu;

        const updated = {
            ...answers,
            [currentQuestion.id_soal]: {
                ...prevAns,
                ragu: newRagu,
            },
        };
        setAnswers(updated);
        saveAnswerToBackend(
            currentQuestion.id_soal,
            prevAns.jawaban || null,
            prevAns.esai || null,
            newRagu
        );
    };

    // Summary calculation
    const totalQuestions = questions.length;
    let answeredCount = 0;
    let raguCount = 0;

    questions.forEach((q) => {
        const a = answers[q.id_soal];
        if (a) {
            if (a.ragu) raguCount++;
            if (q.jenis === 'pg' && a.jawaban) answeredCount++;
            else if (q.jenis === 'esai' && a.esai && a.esai.trim() !== '') answeredCount++;
        }
    });

    const unansweredCount = Math.max(0, totalQuestions - answeredCount);

    // Final finish confirmation
    const handleFinalSubmit = () => {
        router.post(`/siswa/ujian/${ujian.id_ujian}/selesai`);
    };

    // Font size classes
    const fontSizeClass =
        fontSize === 'sm'
            ? 'text-xs sm:text-sm leading-normal'
            : fontSize === 'lg'
            ? 'text-base sm:text-lg leading-relaxed'
            : 'text-sm sm:text-base leading-relaxed';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col font-sans select-none">
            <Head title={`CBT Ujian: ${ujian.mapel}`} />

            {/* Sticky CBT Top Header */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Left: CBT Subject & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                            CBT
                        </div>
                        <div className="truncate">
                            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                                {ujian.mapel}
                            </h1>
                            <p className="text-[11px] text-gray-500 truncate">
                                {siswa.nama} • {siswa.kelas}
                            </p>
                        </div>
                    </div>

                    {/* Center: Countdown Timer Badge */}
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-2xl font-mono text-sm sm:text-base font-black tracking-wider shadow-inner transition-colors ${
                                timeLeft < 300
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : timeLeft < 900
                                    ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-300'
                                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            }`}
                        >
                            <Clock className="size-4 shrink-0" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    {/* Right: Font Switcher & Daftar Soal Toggle */}
                    <div className="flex items-center gap-2">
                        {/* Font size toggles */}
                        <div className="hidden md:flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-0.5 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setFontSize('sm')}
                                className={`px-2 py-1 rounded-lg transition ${
                                    fontSize === 'sm' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-xs' : 'text-gray-500'
                                }`}
                            >
                                A-
                            </button>
                            <button
                                type="button"
                                onClick={() => setFontSize('base')}
                                className={`px-2 py-1 rounded-lg transition ${
                                    fontSize === 'base' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-xs' : 'text-gray-500'
                                }`}
                            >
                                A
                            </button>
                            <button
                                type="button"
                                onClick={() => setFontSize('lg')}
                                className={`px-2 py-1 rounded-lg transition ${
                                    fontSize === 'lg' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-xs' : 'text-gray-500'
                                }`}
                            >
                                A+
                            </button>
                        </div>

                        {/* Drawer Open Button */}
                        <Button
                            onClick={() => setIsDrawerOpen(true)}
                            variant="outline"
                            size="sm"
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 text-xs font-bold gap-1.5 h-9"
                        >
                            <LayoutGrid className="size-4" />
                            <span className="hidden sm:inline">Daftar Soal</span>
                            <span className="bg-indigo-600 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                                {answeredCount}/{totalQuestions}
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Exam Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
                {/* Question Canvas (Left / Center) */}
                <div className="flex-1 flex flex-col justify-between bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 shadow-xs">
                    {currentQuestion ? (
                        <div>
                            {/* Question Header */}
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center size-8 rounded-xl bg-indigo-600 text-white font-black text-sm">
                                        {currentQuestion.nomor}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Soal {currentQuestion.nomor} dari {totalQuestions}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] uppercase font-bold text-indigo-600 border-indigo-200 dark:text-indigo-400"
                                    >
                                        {currentQuestion.jenis === 'pg' ? 'Pilihan Ganda' : 'Esai'}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    {saveStatus === 'saving' ? (
                                        <span className="text-amber-500 animate-pulse text-[11px] font-medium">Menyimpan...</span>
                                    ) : (
                                        <span className="text-emerald-500 inline-flex items-center gap-1 text-[11px] font-medium">
                                            <CheckCircle2 className="size-3.5" />
                                            Tersimpan
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Question Content */}
                            <div
                                className={`prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 mb-8 font-medium ${fontSizeClass}`}
                                dangerouslySetInnerHTML={{ __html: currentQuestion.soal }}
                            />

                            {/* Question Attachments (File/Image/Audio if any) */}
                            {currentQuestion.file && (
                                <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-800/40 max-w-md">
                                    <img
                                        src={currentQuestion.file.startsWith('http') || currentQuestion.file.startsWith('/') ? currentQuestion.file : `/files/${currentQuestion.file}`}
                                        alt="Lampiran Soal"
                                        className="w-full h-auto rounded-xl object-contain max-h-72"
                                    />
                                </div>
                            )}

                            {/* Answer Options: Pilihan Ganda (A, B, C, D, E) */}
                            {currentQuestion.jenis === 'pg' && (
                                <div className="space-y-3 pt-2">
                                    {(['A', 'B', 'C', 'D', 'E'] as const).map((opsi) => {
                                        const optionContent = currentQuestion[`pil${opsi}` as keyof QuestionItem] as string | undefined;
                                        if (!optionContent && opsi === 'E') return null; // E is optional

                                        const isSelected = currentAnswer?.jawaban === opsi;

                                        return (
                                            <button
                                                key={opsi}
                                                type="button"
                                                onClick={() => handleSelectOption(opsi)}
                                                className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-gray-900/60 text-gray-800 dark:text-gray-200'
                                                }`}
                                            >
                                                <div
                                                    className={`size-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm transition-colors ${
                                                        isSelected
                                                            ? 'bg-indigo-600 text-white shadow-xs'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {opsi}
                                                </div>

                                                <div
                                                    className={`flex-1 pt-1 ${fontSizeClass}`}
                                                    dangerouslySetInnerHTML={{ __html: optionContent || `Pilihan ${opsi}` }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Answer Input: Esai */}
                            {currentQuestion.jenis === 'esai' && (
                                <div className="space-y-2 pt-2">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Jawaban Esai Anda:
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={currentAnswer?.esai || ''}
                                        onChange={(e) => handleEssayChange(e.target.value)}
                                        placeholder="Tuliskan jawaban esai lengkap Anda di sini..."
                                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                                    />
                                    <p className="text-[11px] text-gray-400">
                                        Jawaban otomatis tersimpan saat Anda mengetik.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            Tidak ada soal tersedia.
                        </div>
                    )}

                    {/* Bottom Navigation Toolbar */}
                    <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                        {/* Prev Button */}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                            className="rounded-xl h-11 px-4 text-xs font-bold gap-1.5"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Sebelumnya</span>
                        </Button>

                        {/* Ragu-Ragu Toggle Button */}
                        <Button
                            type="button"
                            onClick={handleToggleRagu}
                            className={`rounded-xl h-11 px-5 text-xs font-bold gap-2 transition ${
                                currentAnswer?.ragu
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            }`}
                        >
                            <Flag className={`size-4 ${currentAnswer?.ragu ? 'fill-current' : ''}`} />
                            <span>{currentAnswer?.ragu ? 'Ditandai Ragu-Ragu' : 'Ragu-Ragu'}</span>
                        </Button>

                        {/* Next or Finish Button */}
                        {currentIndex < totalQuestions - 1 ? (
                            <Button
                                type="button"
                                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-5 text-xs font-bold gap-1.5 shadow-md shadow-indigo-600/20"
                            >
                                <span>Berikutnya</span>
                                <ArrowRight className="size-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => setIsFinishModalOpen(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 text-xs font-bold gap-2 shadow-md shadow-emerald-600/20"
                            >
                                <CheckCircle className="size-4" />
                                <span>Selesai Ujian</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sidebar Question Grid (Desktop 1 Col) */}
                <aside className="hidden lg:flex flex-col w-84 shrink-0 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none h-fit sticky top-24">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                                <LayoutGrid className="size-4.5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Lembar Nomor Soal
                                </h2>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Pilih nomor untuk membuka
                                </p>
                            </div>
                        </div>

                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/70 dark:border-indigo-800 font-mono">
                            {answeredCount}/{totalQuestions}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-3.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <span>Progress Ujian</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}% Selesai
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="grid grid-cols-4 gap-1 p-1 mb-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-[10px] font-bold">
                        <button
                            type="button"
                            onClick={() => setFilterMode('semua')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'semua'
                                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-extrabold'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Semua ({totalQuestions})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode('belum')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'belum'
                                    ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-slate-100 shadow-2xs font-extrabold'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Belum ({unansweredCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode('ragu')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'ragu'
                                    ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-2xs font-extrabold'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Ragu ({raguCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode('dijawab')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'dijawab'
                                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-extrabold'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Jawab ({answeredCount})
                        </button>
                    </div>

                    {/* Question Tiles Grid */}
                    <div className="grid grid-cols-5 gap-2 max-h-[440px] overflow-y-auto p-1.5">
                        {questions.map((q, idx) => {
                            const ans = answers[q.id_soal];
                            const isCurrent = idx === currentIndex;
                            const isRagu = ans?.ragu;
                            const isAnswered = ans && (ans.jawaban || (ans.esai && ans.esai.trim() !== ''));

                            // Handle filter visibility
                            if (filterMode === 'belum' && isAnswered) return null;
                            if (filterMode === 'ragu' && !isRagu) return null;
                            if (filterMode === 'dijawab' && !isAnswered) return null;

                            return (
                                <button
                                    key={q.id_soal}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`relative flex items-center justify-center aspect-square rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                                        isCurrent
                                            ? 'border-2 border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-md shadow-indigo-500/20 z-10'
                                            : 'border hover:border-indigo-400 hover:shadow-xs'
                                    } ${
                                        isRagu
                                            ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25 border-transparent font-extrabold'
                                            : isAnswered
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25 border-transparent font-extrabold'
                                            : isCurrent
                                            ? ''
                                            : 'bg-slate-50/90 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-white'
                                    }`}
                                >
                                    <span className={`text-sm font-extrabold leading-none ${ans?.jawaban ? '-translate-y-1' : ''}`}>
                                        {q.nomor}
                                    </span>

                                    {ans?.jawaban && (
                                        <span className="absolute bottom-1 text-[9px] font-black uppercase tracking-wider bg-white/25 px-1.5 py-0.2 rounded leading-none shadow-2xs">
                                            {ans.jawaban}
                                        </span>
                                    )}

                                    {isRagu && (
                                        <Flag className="size-2.5 absolute top-1.5 right-1.5 fill-white text-white drop-shadow-xs" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Interactive Legend Status Cards */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div
                            onClick={() => setFilterMode('dijawab')}
                            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 cursor-pointer hover:bg-emerald-100/70 transition"
                        >
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                Dijawab
                            </span>
                            <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-200 mt-0.5">
                                {answeredCount}
                            </span>
                        </div>

                        <div
                            onClick={() => setFilterMode('ragu')}
                            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 cursor-pointer hover:bg-amber-100/70 transition"
                        >
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                                <Flag className="size-2.5 fill-amber-500 text-amber-500" />
                                Ragu
                            </span>
                            <span className="text-base font-extrabold text-amber-800 dark:text-amber-200 mt-0.5">
                                {raguCount}
                            </span>
                        </div>

                        <div
                            onClick={() => setFilterMode('belum')}
                            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100/70 transition"
                        >
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                Belum
                            </span>
                            <span className="text-base font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
                                {unansweredCount}
                            </span>
                        </div>
                    </div>

                    {/* Selesai Ujian Button */}
                    <Button
                        type="button"
                        onClick={() => setIsFinishModalOpen(true)}
                        className="w-full mt-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold h-12 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all duration-200 active:scale-[0.98]"
                    >
                        <CheckCircle className="size-4.5 stroke-[2.5]" />
                        <span>Selesaikan Ujian</span>
                    </Button>
                </aside>
            </main>

            {/* Mobile Drawer (Daftar Nomor Soal) */}
            <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DialogContent className="max-w-md p-6 rounded-3xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="size-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                                    <LayoutGrid className="size-4.5" />
                                </div>
                                <div className="text-left">
                                    <DialogTitle className="text-base font-extrabold">Lembar Nomor Soal</DialogTitle>
                                    <DialogDescription className="text-xs">
                                        Pilih nomor soal untuk membuka
                                    </DialogDescription>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/70 font-mono">
                                {answeredCount}/{totalQuestions}
                            </span>
                        </div>
                    </DialogHeader>

                    {/* Filter Tabs in Drawer */}
                    <div className="grid grid-cols-4 gap-1 p-1 mt-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                        <button
                            type="button"
                            onClick={() => setFilterMode('semua')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'semua'
                                    ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-2xs font-extrabold'
                                    : 'text-slate-500'
                            }`}
                        >
                            Semua ({totalQuestions})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode('belum')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'belum'
                                    ? 'bg-white dark:bg-gray-700 text-slate-800 shadow-2xs font-extrabold'
                                    : 'text-slate-500'
                            }`}
                        >
                            Belum ({unansweredCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode('ragu')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'ragu'
                                    ? 'bg-white dark:bg-gray-700 text-amber-600 shadow-2xs font-extrabold'
                                    : 'text-slate-500'
                            }`}
                        >
                            Ragu ({raguCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode('dijawab')}
                            className={`py-1.5 rounded-lg transition-all ${
                                filterMode === 'dijawab'
                                    ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-2xs font-extrabold'
                                    : 'text-slate-500'
                            }`}
                        >
                            Jawab ({answeredCount})
                        </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto p-1.5">
                        {questions.map((q, idx) => {
                            const ans = answers[q.id_soal];
                            const isCurrent = idx === currentIndex;
                            const isRagu = ans?.ragu;
                            const isAnswered = ans && (ans.jawaban || (ans.esai && ans.esai.trim() !== ''));

                            if (filterMode === 'belum' && isAnswered) return null;
                            if (filterMode === 'ragu' && !isRagu) return null;
                            if (filterMode === 'dijawab' && !isAnswered) return null;

                            return (
                                <button
                                    key={q.id_soal}
                                    type="button"
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        setIsDrawerOpen(false);
                                    }}
                                    className={`relative flex items-center justify-center aspect-square rounded-2xl text-xs font-bold transition-all duration-150 ${
                                        isCurrent
                                            ? 'border-2 border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-md shadow-indigo-500/20 z-10'
                                            : 'border hover:border-indigo-400'
                                    } ${
                                        isRagu
                                            ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25 border-transparent font-extrabold'
                                            : isAnswered
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25 border-transparent font-extrabold'
                                            : isCurrent
                                            ? ''
                                            : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold'
                                    }`}
                                >
                                    <span className={`text-sm font-extrabold leading-none ${ans?.jawaban ? '-translate-y-1' : ''}`}>
                                        {q.nomor}
                                    </span>

                                    {ans?.jawaban && (
                                        <span className="absolute bottom-1 text-[9px] font-black uppercase tracking-wider bg-white/25 px-1.5 py-0.2 rounded leading-none">
                                            {ans.jawaban}
                                        </span>
                                    )}

                                    {isRagu && (
                                        <Flag className="size-2.5 absolute top-1.5 right-1.5 fill-white text-white" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <DialogFooter className="flex flex-col gap-2 pt-2">
                        <Button
                            type="button"
                            onClick={() => {
                                setIsDrawerOpen(false);
                                setIsFinishModalOpen(true);
                            }}
                            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold h-11 rounded-2xl shadow-lg shadow-red-500/25"
                        >
                            Selesaikan Ujian Sekarang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Selesai Ujian */}
            <Dialog open={isFinishModalOpen} onOpenChange={setIsFinishModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="size-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-2 mx-auto">
                            <AlertTriangle className="size-6" />
                        </div>
                        <DialogTitle className="text-center text-lg font-bold">
                            Konfirmasi Selesai Ujian
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs text-gray-500">
                            Periksa kembali ringkasan jawaban Anda sebelum mengakhiri sesi ujian ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-500">Total Soal:</span>
                            <span className="font-bold">{totalQuestions} Soal</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-emerald-600 font-medium">Sudah Dijawab:</span>
                            <span className="font-bold text-emerald-600">{answeredCount} Soal</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-amber-600 font-medium">Masih Ragu-Ragu:</span>
                            <span className="font-bold text-amber-600">{raguCount} Soal</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-red-500 font-medium">Belum Dijawab:</span>
                            <span className="font-bold text-red-500">{unansweredCount} Soal</span>
                        </div>
                    </div>

                    {(unansweredCount > 0 || raguCount > 0) && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
                            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                            <span>
                                Masih terdapat <strong>{unansweredCount} soal belum dijawab</strong> dan{' '}
                                <strong>{raguCount} soal ditandai ragu-ragu</strong>.
                            </span>
                        </div>
                    )}

                    <div className="pt-2 flex items-start gap-2.5">
                        <input
                            type="checkbox"
                            id="confirmFinish"
                            checked={confirmFinishCheck}
                            onChange={(e) => setConfirmFinishCheck(e.target.checked)}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                        />
                        <label htmlFor="confirmFinish" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                            Saya telah memeriksa seluruh jawaban dan yakin untuk mengakhiri ujian ini.
                        </label>
                    </div>

                    <DialogFooter className="grid grid-cols-2 gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsFinishModalOpen(false)}
                            className="w-full text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            disabled={!confirmFinishCheck}
                            onClick={handleFinalSubmit}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                        >
                            Ya, Selesaikan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
