'use client';

import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { Plus, X, Clock } from 'lucide-react';
import { TimeSlotConfig } from '@/schemas/experience.schema';

interface SlotConfiguratorProps {
    slots: TimeSlotConfig[];
    onSlotsChange: (slots: TimeSlotConfig[]) => void;
    startDate: string;
    endDate: string;
    onDateChange: (field: 'start_date' | 'end_date', value: string) => void;
    defaultCapacity: number;
    onCapacityChange: (capacity: number) => void;
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

export function SlotConfigurator({
    slots,
    onSlotsChange,
    startDate,
    endDate,
    onDateChange,
    defaultCapacity,
    onCapacityChange,
    className,
}: SlotConfiguratorProps) {

    const addSlot = () => {
        const newSlot: TimeSlotConfig = {
            start_hour: 9,
            start_minute: 0,
            end_hour: 17,
            end_minute: 0,
            capacity: defaultCapacity,
            days_of_week: [1, 2, 3, 4, 5], // Mon-Fri by default
        };
        onSlotsChange([...slots, newSlot]);
    };

    const removeSlot = (index: number) => {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        onSlotsChange(newSlots);
    };

    const updateSlot = (index: number, field: keyof TimeSlotConfig, value: number | number[] | undefined) => {
        const newSlots = [...slots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        onSlotsChange(newSlots);
    };

    const toggleDay = (slotIndex: number, day: number) => {
        const slot = slots[slotIndex];
        const currentDays = slot.days_of_week || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day].sort();
        updateSlot(slotIndex, 'days_of_week', newDays.length > 0 ? newDays : undefined);
    };

    const formatTime = (hour: number, minute: number) => {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Date Range */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Input
                    label="Fecha de inicio"
                    type="date"
                    value={startDate}
                    onChange={(e) => onDateChange('start_date', e.target.value)}
                />
                <Input
                    label="Fecha de fin"
                    type="date"
                    value={endDate}
                    onChange={(e) => onDateChange('end_date', e.target.value)}
                />
            </div>

            {/* Default Capacity */}
            <Input
                label="Capacidad por defecto"
                type="number"
                min={1}
                value={defaultCapacity === 0 ? '' : defaultCapacity}
                onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty value during editing
                    if (val === '') {
                        onCapacityChange(0);
                    } else {
                        onCapacityChange(parseInt(val) || 0);
                    }
                }}
                onBlur={(e) => {
                    // Apply default value on blur if empty
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                        onCapacityChange(10);
                    }
                }}
                helperText="Número de personas por horario"
            />

            {/* Slots List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Horarios ({slots.length})
                    </label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSlot}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Agregar horario
                    </Button>
                </div>

                {slots.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay horarios configurados</p>
                        <p className="text-xs mt-1">Agrega horarios para que los turistas puedan reservar</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {slots.map((slot, index) => (
                            <div
                                key={index}
                                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Horario {index + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Time Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Hora inicio</label>
                                        <input
                                            type="time"
                                            value={formatTime(slot.start_hour, slot.start_minute)}
                                            onChange={(e) => {
                                                const [h, m] = e.target.value.split(':').map(Number);
                                                updateSlot(index, 'start_hour', h);
                                                updateSlot(index, 'start_minute', m);
                                            }}
                                            className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Hora fin</label>
                                        <input
                                            type="time"
                                            value={formatTime(slot.end_hour, slot.end_minute)}
                                            onChange={(e) => {
                                                const [h, m] = e.target.value.split(':').map(Number);
                                                updateSlot(index, 'end_hour', h);
                                                updateSlot(index, 'end_minute', m);
                                            }}
                                            className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Days of Week */}
                                <div>
                                    <label className="block text-xs text-slate-500 mb-2">Días de la semana</label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(index, day.value)}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer",
                                                    slot.days_of_week?.includes(day.value)
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                                )}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Slot Capacity Override */}
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">
                                        Capacidad (dejar vacío para usar defecto)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={slot.capacity ?? ''}
                                        placeholder={defaultCapacity.toString()}
                                        onChange={(e) => updateSlot(index, 'capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-24 px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
