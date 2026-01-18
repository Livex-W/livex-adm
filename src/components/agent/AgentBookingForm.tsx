'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Experience, AgentPaymentType, CreateAgentBookingDto } from '@/types';
import { useAgentBookingStore } from '@/lib/agent-booking-store';
import { Button, Input, CurrencyInput, PhoneInput, Card } from '@/components/ui';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';
import { Users, Baby, CreditCard, User as UserIcon, DollarSign, Info } from 'lucide-react';

interface AgentBookingFormProps {
    experience: Experience;
    slotId: string;
    slotPrices?: {
        adultPrice?: number;
        childPrice?: number;
    };
    onCancel: () => void;
}

// Memoized currency formatter
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val / 100);
};

function AgentBookingFormComponent({ experience, slotId, slotPrices, onCancel }: AgentBookingFormProps) {
    const router = useRouter();
    const { createBooking, isLoading, error } = useAgentBookingStore();

    // Check if experience allows children
    const allowsChildren = experience.allows_children ?? true;

    // Use uncontrolled inputs for text fields to avoid re-renders
    const [adultsStr, setAdultsStr] = useState('2');
    const [childrenStr, setChildrenStr] = useState('0');
    const [commissionAdult, setCommissionAdult] = useState(0);
    const [commissionChild, setCommissionChild] = useState(0);
    const [paymentType, setPaymentType] = useState<AgentPaymentType>(AgentPaymentType.FULL_AT_RESORT);
    const [amountPaidToAgent, setAmountPaidToAgent] = useState(0);
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    // Memoize numeric calculations
    const adults = useMemo(() => parseInt(adultsStr, 10) || 0, [adultsStr]);
    const children = useMemo(() => allowsChildren ? (parseInt(childrenStr, 10) || 0) : 0, [childrenStr, allowsChildren]);
    
    const agentCommissionPerAdult = commissionAdult * 100;
    const agentCommissionPerChild = allowsChildren ? commissionChild * 100 : 0;

    // Memoize prices
    const resortNetPerAdult = useMemo(() => 
        slotPrices?.adultPrice || experience.display_price_per_adult || 0,
        [slotPrices?.adultPrice, experience.display_price_per_adult]
    );
    const resortNetPerChild = useMemo(() => 
        allowsChildren ? (slotPrices?.childPrice || experience.display_price_per_child || resortNetPerAdult) : 0,
        [allowsChildren, slotPrices?.childPrice, experience.display_price_per_child, resortNetPerAdult]
    );

    // Memoize totals
    const totalResortNet = useMemo(() => 
        (resortNetPerAdult * adults) + (resortNetPerChild * children),
        [resortNetPerAdult, resortNetPerChild, adults, children]
    );
    const totalAgentCommission = useMemo(() => 
        (agentCommissionPerAdult * adults) + (agentCommissionPerChild * children),
        [agentCommissionPerAdult, agentCommissionPerChild, adults, children]
    );
    const totalClientPrice = totalResortNet + totalAgentCommission;

    const handlePaymentTypeChange = useCallback((type: AgentPaymentType) => {
        setPaymentType(type);
        if (type === AgentPaymentType.COMMISSION_TO_AGENT) {
            setAmountPaidToAgent(totalAgentCommission);
        } else if (type === AgentPaymentType.FULL_AT_RESORT) {
            setAmountPaidToAgent(0);
        }
    }, [totalAgentCommission]);

    useEffect(() => {
        if (paymentType === AgentPaymentType.COMMISSION_TO_AGENT) {
            setAmountPaidToAgent(totalAgentCommission);
        }
    }, [totalAgentCommission, paymentType]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const dto: CreateAgentBookingDto = {
            slotId,
            experienceId: experience.id,
            adults,
            children: allowsChildren ? children : 0,
            agentCommissionPerAdultCents: agentCommissionPerAdult,
            agentCommissionPerChildCents: allowsChildren ? agentCommissionPerChild : 0,
            agentPaymentType: paymentType,
            amountPaidToAgentCents: amountPaidToAgent,
            clientName,
            clientEmail,
            clientPhone,
        };

        try {
            await createBooking(dto);
            toast.success('¡Reserva creada con éxito!');
            router.push(ROUTES.AGENT.BOOKINGS);
        } catch (err) {
            console.error(err);
            toast.error('Error al crear la reserva');
        }
    }, [slotId, experience.id, adults, children, allowsChildren, agentCommissionPerAdult, agentCommissionPerChild, paymentType, amountPaidToAgent, clientName, clientEmail, clientPhone, createBooking, router]);

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

            {/* Sección 2: Comisiones */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">2. Tu Comisión</h3>
                </div>

                <div className={`grid ${allowsChildren ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    <div>
                        <label className={labelClass}>Comisión por Adulto (COP)</label>
                        <CurrencyInput
                            value={commissionAdult}
                            onChange={setCommissionAdult}
                            placeholder="0"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Precio resort: {formatCurrency(resortNetPerAdult)}
                        </p>
                    </div>
                    {allowsChildren && (
                        <div>
                            <label className={labelClass}>Comisión por Niño (COP)</label>
                            <CurrencyInput
                                value={commissionChild}
                                onChange={setCommissionChild}
                                placeholder="0"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Precio resort: {formatCurrency(resortNetPerChild)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección 3: Resumen Financiero */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                <h3 className="font-semibold text-lg text-blue-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> 3. Resumen Financiero
                </h3>
                
                <div className="space-y-3">
                    <div className="bg-white/70 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                                {adults} {adults === 1 ? 'Adulto' : 'Adultos'} × {formatCurrency(resortNetPerAdult + agentCommissionPerAdult)}
                            </span>
                            <span className="font-medium">{formatCurrency((resortNetPerAdult + agentCommissionPerAdult) * adults)}</span>
                        </div>
                        {allowsChildren && children > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                    {children} {children === 1 ? 'Niño' : 'Niños'} × {formatCurrency(resortNetPerChild + agentCommissionPerChild)}
                                </span>
                                <span className="font-medium">{formatCurrency((resortNetPerChild + agentCommissionPerChild) * children)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-blue-200 pt-3 space-y-2">
                        <div className="flex justify-between text-slate-700">
                            <span>Neto Resort:</span>
                            <span className="font-medium">{formatCurrency(totalResortNet)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>🎉 Tu Comisión Total:</span>
                            <span className="text-lg">{formatCurrency(totalAgentCommission)}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between font-bold text-xl border-t border-blue-200 pt-3 text-blue-900">
                        <span>Total a Cobrar:</span>
                        <span>{formatCurrency(totalClientPrice)}</span>
                    </div>
                </div>
            </div>

            {/* Sección 4: Pago */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">4. Método de Pago</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Tipo de Pago</label>
                        <select
                            className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                            value={paymentType}
                            onChange={(e) => handlePaymentTypeChange(e.target.value as AgentPaymentType)}
                        >
                            <option value={AgentPaymentType.FULL_AT_RESORT}>💰 Todo en Resort</option>
                            <option value={AgentPaymentType.COMMISSION_TO_AGENT}>🤝 Solo Comisión (cliente paga en resort)</option>
                            <option value={AgentPaymentType.DEPOSIT_TO_AGENT}>💳 Depósito Parcial</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Monto cobrado por ti (Agente)</label>
                        <CurrencyInput
                            disabled={paymentType !== AgentPaymentType.DEPOSIT_TO_AGENT}
                            value={amountPaidToAgent / 100}
                            onChange={(val) => setAmountPaidToAgent(val * 100)}
                        />
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium">Cliente pagará en resort:</span>{' '}
                                <span className="text-lg font-bold text-slate-900">{formatCurrency(totalClientPrice - amountPaidToAgent)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección 5: Datos del Cliente */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-sky-100 rounded-lg">
                        <UserIcon className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800">5. Datos del Cliente</h3>
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

// Memoize the entire component to prevent unnecessary re-renders
export const AgentBookingForm = memo(AgentBookingFormComponent);
