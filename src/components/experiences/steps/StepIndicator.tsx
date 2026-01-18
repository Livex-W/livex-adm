'use client';

import { Save, Users, Clock, Image as ImageIcon, LucideIcon } from 'lucide-react';

interface Step {
    id: number;
    title: string;
    icon: LucideIcon;
}

const STEPS: Step[] = [
    { id: 1, title: 'Información', icon: Save },
    { id: 2, title: 'Niños', icon: Users },
    { id: 3, title: 'Imágenes', icon: ImageIcon },
    { id: 4, title: 'Temporadas', icon: Clock },
];

interface StepIndicatorProps {
    currentStep: number;
    onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-2">
            {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                    <button
                        type="button"
                        onClick={() => onStepClick(step.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                            ${currentStep === step.id
                                ? 'bg-indigo-600 text-white'
                                : currentStep > step.id
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 cursor-pointer'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-pointer'
                            }
                        `}
                    >
                        <step.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{step.title}</span>
                    </button>
                    {idx < STEPS.length - 1 && (
                        <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700 mx-1" />
                    )}
                </div>
            ))}
        </div>
    );
}
