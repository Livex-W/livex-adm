'use client';

import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import {
    Button,
    Input,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui';
import { Users } from 'lucide-react';
import { CreateExperienceFormData } from '@/schemas/experience.schema';

interface ChildrenConfigStepProps {
    register: UseFormRegister<CreateExperienceFormData>;
    control: Control<CreateExperienceFormData>;
    errors: FieldErrors<CreateExperienceFormData>;
    allowsChildren: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export function ChildrenConfigStep({
    register,
    // control unused for now
    control: _control,
    errors,
    allowsChildren,
    onPrev,
    onNext
}: ChildrenConfigStepProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración de Niños</CardTitle>
                <CardDescription>Define si la experiencia es apta para niños y el rango de edades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <input
                        type="checkbox"
                        id="allows_children"
                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        {...register('allows_children')}
                    />
                    <label htmlFor="allows_children" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-5 w-5 text-slate-500" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            Permitir niños
                        </span>
                    </label>
                </div>

                {allowsChildren && (
                    <div className="grid sm:grid-cols-2 gap-6 animate-in slide-in-from-top-2 fade-in duration-300">
                        <Input
                            label="Edad mínima niño"
                            type="number"
                            min={0}
                            max={17}
                            {...register('child_min_age', { valueAsNumber: true })}
                            error={errors.child_min_age?.message}
                        />
                        <Input
                            label="Edad máxima niño"
                            type="number"
                            min={0}
                            max={17}
                            {...register('child_max_age', { valueAsNumber: true })}
                            error={errors.child_max_age?.message}
                        />
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onPrev}>
                        Anterior
                    </Button>
                    <Button type="button" onClick={onNext}>
                        Siguiente
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
