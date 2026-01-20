'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-end sticky top-0 z-30">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
                <Menu className="h-6 w-6" />
            </button>

        </header>
    );
}
