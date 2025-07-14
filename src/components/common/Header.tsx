'use client';

import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import NavLink from './NavLink';

const nav = [
    { href: '/', label: 'Dashboard' },
    { href: '/resorts', label: 'Resorts' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/users', label: 'Users' },
    { href: '/finances', label: 'Finances' },
];

export default function Header() {
    return (
        <header className="flex items-center justify-between border-b border-[var(--accent-color)] bg-white px-8 py-4">
            {/* Logo + título */}
            <div className="flex items-center gap-4">
                <svg
                    className="size-8 text-[var(--primary-color)]"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                >
                    <path d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" />
                </svg>
                <h2 className="text-xl font-bold tracking-tighter">Livex Admin</h2>
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
                {nav.map(({ href, label }) => (
                    <NavLink key={href} href={href} label={label} />
                ))}
            </nav>

            {/* Acciones */}
            <div className="flex items-center gap-4">
                <button className="flex size-10 items-center justify-center rounded-full bg-[var(--secondary-color)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-color)] hover:text-[var(--text-primary)]">
                    <BellIcon className="size-5" />
                </button>
                <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5W2Uex8Kcz7RgxuI7gLD5-l_nvjgfCstQKegRis5KnyLDOovm--re0OfzvrqBg8QMRqMHGZnnYl_TTi5w3YP9qJFfj9SuROP8rHQFwMvLEDGcvGBAX9g6uJfE1RuNDmKFKxKjq86ZqZIAb29vLkoTDCSvzsUfj7jDkYIkZrR2rC2W3Fnagb_KHRk0o__Tra9lMJ8myxRNACgpi9-rhtSYicovnC6Agw3j-dbSxs2qed-_sYLciRXB8CMxQAf3SUep6MlIf6Yj8w"
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-[var(--primary-color)] ring-offset-2 object-cover"
                />
            </div>
        </header>
    );
}
