import React from 'react';


export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-20 xl:px-24 bg-white dark:bg-slate-950">
                <div className="w-full max-w-sm mx-auto lg:max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-primary">Livex ADM</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Portal de gestión para administradores
                        </p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right Side - Image/Banner */}
            <div className="hidden lg:block relative bg-slate-900">
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] z-10" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-12 text-center">
                    <h2 className="text-4xl font-bold mb-6">Gestiona tus reservas</h2>
                    <p className="text-lg text-slate-200 max-w-lg">
                        Controla tus reservas, finanzas y reservas desde un solo lugar.
                        Maximiza tus ingresos con Livex.
                    </p>
                </div>
                {/* Placeholder for cover image if available */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900" />
            </div>
        </div>
    );
}
