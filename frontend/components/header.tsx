'use client';

import Link from 'next/link';
import { LanguageToggle } from './language-toggle';

export function Header() {
    return (
        <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        YojanaHub
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block">
                        For Government/NGOs
                    </Link>
                    <LanguageToggle />
                </div>
            </div>
        </header>
    );
}
