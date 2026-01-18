'use client';

import { Palmtree, Calendar, FileText, LucideIcon } from 'lucide-react';

interface Step {
    id: number;
    title: string;
    icon: LucideIcon;
}

const BOOKING_STEPS: Step[] = [
    { id: 1, title: 'Experiencia', icon: Palmtree },
    { id: 2, title: 'Fecha y Hora', icon: Calendar },
    { id: 3, title: 'Datos', icon: FileText },
];

interface BookingStepIndicatorProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export function BookingStepIndicator({ currentStep, onStepClick }: BookingStepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-2">
            {BOOKING_STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                    <button
                        type="button"
                        onClick={() => onStepClick?.(step.id)}
                        disabled={!onStepClick || step.id > currentStep}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                            ${currentStep === step.id
                                ? 'bg-indigo-600 text-white'
                                : currentStep > step.id
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 cursor-pointer hover:bg-indigo-200'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }
                        `}
                    >
                        <step.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{step.title}</span>
                    </button>
                    {idx < BOOKING_STEPS.length - 1 && (
                        <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? 'bg-indigo-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                </div>
            ))}
        </div>
    );
}
