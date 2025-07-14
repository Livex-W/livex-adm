'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
    href: string;
    label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`transition-colors ${isActive
                    ? 'font-semibold text-[var(--primary-color)]'
                    : 'hover:text-[var(--primary-color)]'
                }`}
        >
            {label}
        </Link>
    );
}
