import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    FileEdit,
    FileSpreadsheet,
    HelpCircle,
    LayoutGrid,
    Megaphone,
    Monitor,
    Printer,
    UserCheck,
    UserCog,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const role = auth?.user?.role || 'siswa';

    // Role-specific navigation groups matching Candy CBT UI
    const getNavGroups = (): NavGroup[] => {
        if (role === 'admin') {
            return [
                {
                    title: 'MENU UTAMA',
                    items: [
                        {
                            title: 'Dashboard Admin',
                            url: '/admin/dashboard',
                            icon: LayoutGrid,
                        },
                        {
                            title: 'Data Master',
                            icon: Briefcase,
                            items: [
                                { title: 'Mata Pelajaran', url: '/admin/master?tab=mapel' },
                                { title: 'Data Kelas', url: '/admin/master?tab=kelas' },
                                { title: 'Data Ruang', url: '/admin/master?tab=ruang' },
                                { title: 'Data Sesi', url: '/admin/master?tab=sesi' },
                                { title: 'Jurusan / PK', url: '/admin/master?tab=jurusan' },
                                { title: 'Level Kelas', url: '/admin/master?tab=level' },
                                { title: 'Server Lokal', url: '/admin/master?tab=server' },
                            ],
                        },
                        {
                            title: 'Peserta Ujian',
                            url: '/admin/siswa',
                            icon: Users,
                        },
                        {
                            title: 'Bank Soal',
                            icon: BookOpen,
                            items: [
                                { title: 'Daftar Bank Soal', url: '/admin/bank-soal' },
                            ],
                        },
                        {
                            title: 'Status Peserta',
                            url: '/admin/status-peserta',
                            icon: UserCheck,
                        },
                        {
                            title: 'Menu Ujian',
                            icon: Monitor,
                            items: [
                                { title: 'Jadwal Ujian', url: '/admin/jadwal-ujian' },
                                { title: 'Token Ujian', url: '/admin/token-ujian' },
                            ],
                        },
                        {
                            title: 'Nilai',
                            icon: FileEdit,
                            items: [
                                { title: 'Rekap Nilai Ujian', url: '/admin/rekap-nilai' },
                            ],
                        },
                        {
                            title: 'Cetak',
                            icon: Printer,
                            items: [
                                { title: 'Cetak Kartu Peserta', url: '/admin/cetak?type=kartu' },
                                { title: 'Cetak Daftar Hadir', url: '/admin/cetak?type=absen' },
                                { title: 'Cetak Berita Acara', url: '/admin/cetak?type=berita-acara' },
                            ],
                        },
                        {
                            title: 'Pengumuman',
                            url: '/admin/pengumuman',
                            icon: Megaphone,
                        },
                        {
                            title: 'Manajemen User',
                            icon: UserCog,
                            items: [
                                { title: 'Data Guru', url: '/admin/guru' },
                                { title: 'Data Administrator', url: '/admin/pengawas' },
                            ],
                        },
                    ],
                },
                {
                    title: 'PENGATURAN',
                    items: [
                        {
                            title: 'Pengaturan',
                            url: '/admin/pengaturan',
                            icon: Wrench,
                        },
                    ],
                },
            ];
        }

        if (role === 'guru') {
            return [
                {
                    title: 'MENU UTAMA',
                    items: [
                        {
                            title: 'Dashboard Guru',
                            url: '/guru/dashboard',
                            icon: LayoutGrid,
                        },
                        {
                            title: 'Bank Soal Saya',
                            url: '#',
                            icon: BookOpen,
                        },
                        {
                            title: 'Jadwal & Soal',
                            url: '#',
                            icon: Calendar,
                        },
                        {
                            title: 'Monitoring Ujian',
                            url: '#',
                            icon: Activity,
                        },
                        {
                            title: 'Penilaian Siswa',
                            url: '#',
                            icon: Award,
                        },
                    ],
                },
            ];
        }

        // Default: Siswa
        return [
            {
                title: 'MENU UTAMA',
                items: [
                    {
                        title: 'Dashboard Siswa',
                        url: '/siswa/dashboard',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Daftar Ujian Aktif',
                        url: '#',
                        icon: Clock,
                    },
                    {
                        title: 'Hasil & Riwayat',
                        url: '#',
                        icon: CheckCircle2,
                    },
                ],
            },
        ];
    };

    const navGroups = getNavGroups();

    const footerNavItems: NavItem[] = [
        {
            title: 'Panduan Ujian',
            url: '#',
            icon: HelpCircle,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader className="border-b border-sidebar-border/60 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 pt-2">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
