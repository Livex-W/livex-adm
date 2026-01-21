'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/ui';
import { User, Bell, Lock, Save } from 'lucide-react';

export default function PartnerSettingsPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Perfil', icon: User },
        // { id: 'notifications', label: 'Notificaciones', icon: Bell },
        // { id: 'security', label: 'Seguridad', icon: Lock },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Configuración
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Administra tu perfil y preferencias de cuenta.
                </p>
            </div>

            <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
                {/* Sidebar Nav */}
                <nav className="flex flex-col space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                                    ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
                `}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Content */}
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className={activeTab === 'profile' ? 'block space-y-6' : 'hidden'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Perfil</CardTitle>
                                <CardDescription>Tu información personal y de contacto</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xl">
                                        {user?.fullName?.substring(0, 2).toUpperCase() || 'PA'}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                            {user?.fullName || 'Partner'}
                                        </h2>
                                        <span className="inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded">
                                            Partner
                                        </span>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Nombre Completo"
                                        defaultValue={user?.fullName || ''}
                                        disabled
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        disabled
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Teléfono"
                                        defaultValue={user?.phone || ''}
                                        disabled
                                    />
                                    <Input
                                        label="Rol"
                                        defaultValue={user?.role || ''}
                                        disabled
                                    />
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400 pt-2">
                                    Para modificar tu información de perfil, contacta al administrador.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notifications Section */}
                    <div className={activeTab === 'notifications' ? 'block space-y-6' : 'hidden'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferencias de Notificaciones</CardTitle>
                                <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-slate-100">Nuevas reservas</p>
                                            <p className="text-sm text-slate-500">Recibir notificación cuando se use tu código</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-slate-100">Reservas confirmadas</p>
                                            <p className="text-sm text-slate-500">Notificar cuando una reserva sea confirmada</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-slate-100">Resumen semanal</p>
                                            <p className="text-sm text-slate-500">Recibir resumen semanal de estadísticas</p>
                                        </div>
                                        <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>
                                        Guardar Preferencias
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Security Section */}
                    <div className={activeTab === 'security' ? 'block space-y-6' : 'hidden'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Cambiar Contraseña</CardTitle>
                                <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Contraseña Actual"
                                    type="password"
                                    placeholder="••••••••"
                                />
                                <Input
                                    label="Nueva Contraseña"
                                    type="password"
                                    placeholder="••••••••"
                                />
                                <Input
                                    label="Confirmar Nueva Contraseña"
                                    type="password"
                                    placeholder="••••••••"
                                />

                                <div className="flex justify-end pt-4">
                                    <Button leftIcon={<Save className="h-4 w-4" />}>
                                        Actualizar Contraseña
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
