'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Experience } from '@/types';
import { useResortBookingStore, CreateResortBookingDto } from '@/lib/resort-booking-store';
import { Button, Input, PhoneInput } from '@/components/ui';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';
import { Users, Baby, CreditCard, User as UserIcon, Info } from 'lucide-react';

interface ResortBookingFormProps {
    experience: Experience;
    slotId: string;
    slotPrices?: {
        adultPrice?: number;
        childPrice?: number;
    };
    onCancel: () => void;
}

// Memoized currency formatter - defined outside component
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val / 100);
};

function ResortBookingFormComponent({ experience, slotId, slotPrices, onCancel }: ResortBookingFormProps) {
    const router = useRouter();
    const { createBooking, isLoading, error } = useResortBookingStore();

    // Check if experience allows children
    const allowsChildren = experience.allows_children ?? true;

    // String states para permitir vacío y 0 en inputs de Turistas
    const [adultsStr, setAdultsStr] = useState('2');
    const [childrenStr, setChildrenStr] = useState('0');

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    // Valores numéricos para cálculos - memoized
    const adults = useMemo(() => parseInt(adultsStr, 10) || 0, [adultsStr]);
    const children = useMemo(() => allowsChildren ? (parseInt(childrenStr, 10) || 0) : 0, [childrenStr, allowsChildren]);

    // Precios del slot seleccionado (prioritario) o fallback a experiencia - memoized
    const resortNetPerAdult = useMemo(() =>
        slotPrices?.adultPrice || experience.display_price_per_adult || 0,
        [slotPrices?.adultPrice, experience.display_price_per_adult]
    );
    const resortNetPerChild = useMemo(() =>
        allowsChildren ? (slotPrices?.childPrice || experience.display_price_per_child || resortNetPerAdult) : 0,
        [allowsChildren, slotPrices?.childPrice, experience.display_price_per_child, resortNetPerAdult]
    );

    const totalResortNet = useMemo(() =>
        (resortNetPerAdult * adults) + (resortNetPerChild * children),
        [resortNetPerAdult, resortNetPerChild, adults, children]
    );

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const dto: CreateResortBookingDto = {
            slotId,
            experienceId: experience.id,
            adults,
            children: allowsChildren ? children : 0,
            clientName,
            clientEmail,
            clientPhone,
        };

        try {
            await createBooking(dto);
            toast.success('¡Reserva creada con éxito!');
            router.push(ROUTES.DASHBOARD.BOOKINGS);
        } catch (err) {
            console.error(err);
            toast.error('Error al crear la reserva');
        }
    }, [slotId, experience.id, adults, children, allowsChildren, clientName, clientEmail, clientPhone, createBooking, router]);

    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Sección 1: Turistas */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">1. Turistas</h3>
                </div>

                <div className={`grid ${allowsChildren ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    <div>
                        <label className={labelClass}>
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" /> Adultos
                            </span>
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={adultsStr}
                            onChange={e => setAdultsStr(e.target.value)}
                            onBlur={() => { if (adults < 1) setAdultsStr('1'); }}
                            className="text-lg font-medium"
                        />
                    </div>
                    {allowsChildren && (
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <Baby className="h-4 w-4" /> Niños
                                </span>
                            </label>
                            <Input
                                type="number"
                                min={0}
                                value={childrenStr}
                                onChange={e => setChildrenStr(e.target.value)}
                                className="text-lg font-medium"
                            />
                        </div>
                    )}
                </div>

                {!allowsChildren && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                        <Info className="h-4 w-4" />
                        <span>Esta experiencia es solo para adultos</span>
                    </div>
                )}
            </div>

            {/* Sección 2: Resumen Financiero */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                <h3 className="font-semibold text-lg text-blue-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> 2. Resumen Financiero
                </h3>

                <div className="space-y-3">
                    <div className="bg-white/70 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                                {adults} {adults === 1 ? 'Adulto' : 'Adultos'} × {formatCurrency(resortNetPerAdult)}
                            </span>
                            <span className="font-medium">{formatCurrency(resortNetPerAdult * adults)}</span>
                        </div>
                        {allowsChildren && children > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                    {children} {children === 1 ? 'Niño' : 'Niños'} × {formatCurrency(resortNetPerChild)}
                                </span>
                                <span className="font-medium">{formatCurrency(resortNetPerChild * children)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between font-bold text-xl border-t border-blue-200 pt-3 text-blue-900">
                        <span>Total a Cobrar:</span>
                        <span>{formatCurrency(totalResortNet)}</span>
                    </div>
                </div>
            </div>

            {/* Sección 3: Datos del Cliente */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-sky-100 rounded-lg">
                        <UserIcon className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">3. Datos del Cliente</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className={labelClass}>Nombre Completo *</label>
                        <Input
                            required
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            placeholder="Nombre del cliente"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Email *</label>
                            <Input
                                type="email"
                                required
                                value={clientEmail}
                                onChange={e => setClientEmail(e.target.value)}
                                placeholder="email@ejemplo.com"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Teléfono</label>
                            <PhoneInput
                                value={clientPhone}
                                onChange={setClientPhone}
                                defaultCountry="co"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} size="lg">
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} size="lg" className="px-8">
                    {isLoading ? 'Creando...' : '✓ Confirmar Reserva'}
                </Button>
            </div>
        </form>
    );
}

export const ResortBookingForm = memo(ResortBookingFormComponent);
