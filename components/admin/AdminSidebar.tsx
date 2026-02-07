'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, Store, Layers } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file, if not I'll just use template literals

const navItems = [
    {
        title: 'Overview', // Dashboard
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Sections',
        href: '/admin/sections',
        icon: Layers,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Store Front',
        href: '/',
        icon: Store,
    }
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-zinc-900 border-r border-white/10 text-white min-h-screen p-4 hidden md:block">
            <div className="mb-8 px-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Admin Panel
                </h1>
            </div>
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-white/10 text-white font-medium'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
