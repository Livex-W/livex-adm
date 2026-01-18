'use client';

import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
    Button,
    Input,
    Textarea,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui';
import { CategorySelect, TagInput } from '@/components/experiences';
import { CreateExperienceFormData } from '@/schemas/experience.schema';

interface BasicInfoStepProps {
    register: UseFormRegister<CreateExperienceFormData>;
    control: Control<CreateExperienceFormData>;
    errors: FieldErrors<CreateExperienceFormData>;
    onNext: () => void;
}

export function BasicInfoStep({ register, control, errors, onNext }: BasicInfoStepProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Describe tu experiencia para atraer turistas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Input
                    label="Título de la Experiencia *"
                    placeholder="Ej. Pasadía en Isla Privada"
                    {...register('title')}
                    error={errors.title?.message}
                />

                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <CategorySelect
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.category?.message}
                        />
                    )}
                />

                <Textarea
                    label="Descripción"
                    placeholder="Describe qué hace única a esta experiencia..."
                    rows={5}
                    {...register('description')}
                    error={errors.description?.message}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                    <Controller
                        name="includes"
                        control={control}
                        render={({ field }) => (
                            <TagInput
                                label="¿Qué incluye?"
                                placeholder="Ej. Transporte"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Controller
                        name="excludes"
                        control={control}
                        render={({ field }) => (
                            <TagInput
                                label="¿Qué NO incluye?"
                                placeholder="Ej. Propinas"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="button" onClick={onNext}>
                        Siguiente
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
