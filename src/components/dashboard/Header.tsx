'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between lg:justify-end sticky top-0 z-30">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                </button>

                {/* Could add more header items here like language switcher */}
            </div>
        </header>
    );
}
