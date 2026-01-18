'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, PhoneInput } from '@/components/ui';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ROUTES } from '@/routes';
import { BookingStepIndicator } from '@/components/agent/BookingStepIndicator';
import apiClient from '@/lib/api-client';
import { Experience } from '@/types';

// Simple form component with its own isolated state
function ResortFormContent({
    experience,
    slotId,
    slotInfo
}: {
    experience: Experience;
    slotId: string;
    slotInfo: { date: string; startTime: string; endTime: string; remaining: number; priceAdult?: number; priceChild?: number };
}) {
    const router = useRouter();

    // Check if experience allows children
    const allowsChildren = experience.allows_children ?? true;

    // Form state - completely isolated
    const [adultsStr, setAdultsStr] = useState('2');
    const [childrenStr, setChildrenStr] = useState('0');
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Parse values for calculations
    const adults = parseInt(adultsStr, 10) || 0;
    const children = allowsChildren ? (parseInt(childrenStr, 10) || 0) : 0;

    // Prices in cents
    const priceAdultCents = slotInfo.priceAdult || experience.display_price_per_adult || 0;
    const priceChildCents = allowsChildren ? (slotInfo.priceChild || experience.display_price_per_child || priceAdultCents) : 0;

    // Totals
    const totalResort = (priceAdultCents * adults) + (priceChildCents * children);

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cents / 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await apiClient.post('/api/v1/bookings/resort', {
                slotId,
                experienceId: experience.id,
                adults,
                children: allowsChildren ? children : 0,
                clientName,
                clientEmail,
                clientPhone,
            });
            router.push(ROUTES.DASHBOARD.BOOKINGS);
        } catch (err) {
            console.error(err);
            setSubmitError('Error al crear la reserva');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Completar Reserva</h1>
                    <p className="text-slate-500 mt-1">{experience.title}</p>
                </div>
            </div>

            {/* Step Indicator */}
            <BookingStepIndicator currentStep={3} />

            {/* Slot Summary */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <span>📅 {formatDateDisplay(slotInfo.date)}</span>
                    <span>🕐 {slotInfo.startTime} - {slotInfo.endTime}</span>
                    <span>👥 {slotInfo.remaining} cupos</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Turistas */}
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">1. Turistas</h3>
                    <div className={`grid ${allowsChildren ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Adultos</label>
                            <input
                                type="number"
                                min={1}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={adultsStr}
                                onChange={e => setAdultsStr(e.target.value)}
                                onBlur={() => { if (adults < 1) setAdultsStr('1'); }}
                            />
                        </div>
                        {allowsChildren && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Niños</label>
                                <input
                                    type="number"
                                    min={0}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={childrenStr}
                                    onChange={e => setChildrenStr(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    {!allowsChildren && (
                        <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                            ⓘ Esta experiencia es solo para adultos
                        </p>
                    )}
                </div>

                {/* 2. Resumen Financiero */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-lg mb-4 text-blue-900">2. Resumen Financiero</h3>
                    <div className="space-y-3">
                        <div className="bg-white/70 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{adults} Adultos × {formatCurrency(priceAdultCents)}</span>
                                <span className="font-medium">{formatCurrency(priceAdultCents * adults)}</span>
                            </div>
                            {allowsChildren && children > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span>{children} Niños × {formatCurrency(priceChildCents)}</span>
                                    <span className="font-medium">{formatCurrency(priceChildCents * children)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t border-blue-200 pt-3 text-blue-900">
                            <span>Total a Cobrar:</span>
                            <span>{formatCurrency(totalResort)}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Datos Cliente */}
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">3. Datos del Cliente</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Nombre del cliente"
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="email@ejemplo.com"
                                    value={clientEmail}
                                    onChange={e => setClientEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Teléfono</label>
                                <PhoneInput
                                    value={clientPhone}
                                    onChange={setClientPhone}
                                    defaultCountry="co"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                        {submitError}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => router.back()} size="lg">
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} size="lg" className="px-8">
                        {isSubmitting ? 'Creando...' : '✓ Confirmar Reserva'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Main page component - minimal, just fetches data
export default function ResortBookingFormPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const experienceId = searchParams.get('experienceId');
    const slotId = searchParams.get('slotId');
    const date = searchParams.get('date') || '';
    const startTime = searchParams.get('startTime') || '';
    const endTime = searchParams.get('endTime') || '';
    const remaining = parseInt(searchParams.get('remaining') || '0', 10);
    const priceAdult = parseInt(searchParams.get('priceAdult') || '0', 10);
    const priceChild = parseInt(searchParams.get('priceChild') || '0', 10);

    const [experience, setExperience] = useState<Experience | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!experienceId || !slotId) {
            router.push(ROUTES.DASHBOARD.BOOKINGS + '/new');
            return;
        }

        const fetchExperience = async () => {
            try {
                const response = await apiClient.get<Experience>(
                    `/api/v1/experiences/management/${experienceId}`
                );
                setExperience(response.data);
            } catch (err) {
                console.error('Error fetching experience', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperience();
    }, [experienceId, slotId, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!experience || !slotId) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 mb-4">Error: Datos incompletos</p>
                <Button onClick={() => router.push(ROUTES.DASHBOARD.BOOKINGS + '/new')}>Volver</Button>
            </div>
        );
    }

    return (
        <ResortFormContent
            experience={experience}
            slotId={slotId}
            slotInfo={{
                date,
                startTime,
                endTime,
                remaining,
                priceAdult: priceAdult || undefined,
                priceChild: priceChild || undefined,
            }}
        />
    );
}
