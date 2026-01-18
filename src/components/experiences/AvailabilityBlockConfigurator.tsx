'use client';

import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { Plus, X, Clock, Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { AvailabilityBlock } from '@/lib/experience-form-store';
import { TimeSlotConfig } from '@/schemas/experience.schema';
import { useState } from 'react';

interface AvailabilityBlockConfiguratorProps {
    blocks: AvailabilityBlock[];
    onAddBlock: () => void;
    onRemoveBlock: (blockId: string) => void;
    onUpdateBlock: (blockId: string, updates: Partial<Omit<AvailabilityBlock, 'id'>>) => void;
    onAddSlot: (blockId: string, slot: TimeSlotConfig) => void;
    onRemoveSlot: (blockId: string, slotIndex: number) => void;
    className?: string;
}

const DAYS_OF_WEEK = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
    { value: 6, label: 'Sáb' },
];

export function AvailabilityBlockConfigurator({
    blocks,
    onAddBlock,
    onRemoveBlock,
    onUpdateBlock,
    onAddSlot,
    onRemoveSlot,
    className,
    allowsChildren = true,
}: AvailabilityBlockConfiguratorProps & { allowsChildren?: boolean }) {
    const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
        new Set(blocks.map(b => b.id))
    );

    const toggleExpanded = (blockId: string) => {
        setExpandedBlocks(prev => {
            const next = new Set(prev);
            if (next.has(blockId)) {
                next.delete(blockId);
            } else {
                next.add(blockId);
            }
            return next;
        });
    };

    const addSlotToBlock = (blockId: string) => {
        const block = blocks.find(b => b.id === blockId);
        const newSlot: TimeSlotConfig = {
            start_hour: 9,
            start_minute: 0,
            end_hour: 17,
            end_minute: 0,
            capacity: block?.defaultCapacity || 10,
            days_of_week: [1, 2, 3, 4, 5],
        };
        onAddSlot(blockId, newSlot);
    };

    const updateSlotInBlock = (
        blockId: string,
        slotIndex: number,
        field: keyof TimeSlotConfig,
        value: number | number[] | undefined
    ) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;

        const newSlots = [...block.slots];
        newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
        onUpdateBlock(blockId, { slots: newSlots });
    };

    const toggleDay = (blockId: string, slotIndex: number, day: number) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;

        const slot = block.slots[slotIndex];
        const currentDays = slot.days_of_week || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day].sort();
        updateSlotInBlock(blockId, slotIndex, 'days_of_week', newDays.length > 0 ? newDays : undefined);
    };

    const formatTime = (hour: number | undefined, minute: number | undefined) => {
        const h = hour ?? 0;
        const m = minute ?? 0;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const formatPrice = (value: number) => {
        if (!value) return '';
        return new Intl.NumberFormat('es-CO').format(value);
    };

    const parsePrice = (value: string): number => {
        return parseInt(value.replace(/\D/g, '') || '0', 10);
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            Temporadas y Disponibilidad
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Cada temporada tiene sus propios precios y horarios
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddBlock}
                    leftIcon={<Plus className="h-4 w-4" />}
                    className="w-full sm:w-auto"
                >
                    + Agregar Temporada
                </Button>
            </div>

            {blocks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay bloques configurados</p>
                    <p className="text-xs mt-1">Agrega bloques de disponibilidad con diferentes rangos de fechas</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block, blockIndex) => (
                        <div
                            key={block.id}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                        >
                            {/* Block Header */}
                            <div
                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                                onClick={() => toggleExpanded(block.id)}
                            >
                                <div className="flex items-center gap-3">
                                    {expandedBlocks.has(block.id) ? (
                                        <ChevronUp className="h-4 w-4 text-slate-500" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-slate-500" />
                                    )}
                                    <div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            📅 Temporada {blockIndex + 1}
                                        </span>
                                        <p className="text-xs text-slate-500">
                                            {block.startDate} → {block.endDate} • {block.slots.length} horarios
                                            {block.pricePerAdult > 0 && (
                                                <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                                                    ${block.pricePerAdult.toLocaleString()}/adulto
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {blocks.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveBlock(block.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Block Content */}
                            {expandedBlocks.has(block.id) && (
                                <div className="p-4 space-y-4">
                                    {/* Date Range */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Fecha de inicio"
                                            type="date"
                                            value={block.startDate}
                                            onChange={(e) => onUpdateBlock(block.id, { startDate: e.target.value })}
                                        />
                                        <Input
                                            label="Fecha de fin"
                                            type="date"
                                            value={block.endDate}
                                            onChange={(e) => onUpdateBlock(block.id, { endDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Default Capacity */}
                                    <Input
                                        label="Capacidad por defecto"
                                        type="number"
                                        min={1}
                                        value={block.defaultCapacity === 0 ? '' : block.defaultCapacity}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Allow empty value during editing
                                            if (val === '') {
                                                onUpdateBlock(block.id, { defaultCapacity: 0 });
                                            } else {
                                                onUpdateBlock(block.id, { defaultCapacity: parseInt(val) || 0 });
                                            }
                                        }}
                                        onBlur={(e) => {
                                            // Apply default value on blur if empty
                                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                                onUpdateBlock(block.id, { defaultCapacity: 10 });
                                            }
                                        }}
                                        helperText="Número de personas por horario"
                                    />

                                    {/* Precios de Temporada - OBLIGATORIOS */}
                                    <div className="space-y-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                                💰 Precios de esta Temporada
                                            </span>
                                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                                Obligatorio
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            <Input
                                                label="Precio Adulto (Neto) *"
                                                type="text"
                                                value={formatPrice(block.pricePerAdult)}
                                                onChange={(e) => onUpdateBlock(block.id, {
                                                    pricePerAdult: parsePrice(e.target.value)
                                                })}
                                                placeholder="190.000"
                                                required
                                            />
                                            <Input
                                                label="Comisión Adulto *"
                                                type="text"
                                                value={formatPrice(block.commissionPerAdult)}
                                                onChange={(e) => onUpdateBlock(block.id, {
                                                    commissionPerAdult: parsePrice(e.target.value)
                                                })}
                                                placeholder="35.000"
                                            />
                                            {allowsChildren && (
                                                <>
                                                    <Input
                                                        label="Precio Niño (Neto) *"
                                                        type="text"
                                                        value={formatPrice(block.pricePerChild)}
                                                        onChange={(e) => onUpdateBlock(block.id, {
                                                            pricePerChild: parsePrice(e.target.value)
                                                        })}
                                                        placeholder="150.000"
                                                    />
                                                    <Input
                                                        label="Comisión Niño *"
                                                        type="text"
                                                        value={formatPrice(block.commissionPerChild)}
                                                        onChange={(e) => onUpdateBlock(block.id, {
                                                            commissionPerChild: parsePrice(e.target.value)
                                                        })}
                                                        placeholder="25.000"
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Precios en COP (pesos). La comisión es lo que recibes por cada reserva.
                                        </p>
                                    </div>

                                    {/* Slots */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Horarios ({block.slots.length})
                                            </label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => addSlotToBlock(block.id)}
                                                leftIcon={<Plus className="h-3 w-3" />}
                                            >
                                                Agregar
                                            </Button>
                                        </div>

                                        {block.slots.length === 0 ? (
                                            <div className="text-center py-4 text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-700 rounded">
                                                <Clock className="h-5 w-5 mx-auto mb-1 opacity-50" />
                                                Sin horarios
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {block.slots.map((slot, slotIndex) => (
                                                    <div
                                                        key={slotIndex}
                                                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <span className="text-xs font-medium text-slate-500">
                                                                Horario {slotIndex + 1}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => onRemoveSlot(block.id, slotIndex)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>

                                                        {/* Time */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs text-slate-500 mb-1">Inicio</label>
                                                                <input
                                                                    type="time"
                                                                    value={formatTime(slot.start_hour, slot.start_minute)}
                                                                    onChange={(e) => {
                                                                        const [h, m] = e.target.value.split(':').map(Number);
                                                                        updateSlotInBlock(block.id, slotIndex, 'start_hour', h);
                                                                        updateSlotInBlock(block.id, slotIndex, 'start_minute', m);
                                                                    }}
                                                                    className="w-full px-2 py-1.5 text-sm rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-slate-500 mb-1">Fin</label>
                                                                <input
                                                                    type="time"
                                                                    value={formatTime(slot.end_hour, slot.end_minute)}
                                                                    onChange={(e) => {
                                                                        const [h, m] = e.target.value.split(':').map(Number);
                                                                        updateSlotInBlock(block.id, slotIndex, 'end_hour', h);
                                                                        updateSlotInBlock(block.id, slotIndex, 'end_minute', m);
                                                                    }}
                                                                    className="w-full px-2 py-1.5 text-sm rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Days */}
                                                        <div>
                                                            <label className="block text-xs text-slate-500 mb-1">Días</label>
                                                            <div className="flex flex-wrap gap-1">
                                                                {DAYS_OF_WEEK.map((day) => (
                                                                    <button
                                                                        key={day.value}
                                                                        type="button"
                                                                        onClick={() => toggleDay(block.id, slotIndex, day.value)}
                                                                        className={cn(
                                                                            "px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer",
                                                                            slot.days_of_week?.includes(day.value)
                                                                                ? "bg-indigo-600 text-white"
                                                                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                                                        )}
                                                                    >
                                                                        {day.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
