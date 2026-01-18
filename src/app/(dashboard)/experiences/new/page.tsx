'use client';

import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui';
import {
    StepIndicator,
    BasicInfoStep,
    ChildrenConfigStep,
    ImagesStep,
    AvailabilityStep,
} from '@/components/experiences';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/routes';
import { useExperienceForm } from '@/hooks';
import { createExperienceSchema, CreateExperienceFormData } from '@/schemas/experience.schema';

export default function NewExperiencePage() {
    const {
        resortId,
        isResortLoading,
        images,
        setImages,
        availabilityBlocks,
        addBlock,
        removeBlock,
        updateBlock,
        addSlotToBlock,
        removeSlotFromBlock,
        step,
        setStep,
        submitExperience,
        isSubmitting,
    } = useExperienceForm();

    const {
        register,
        control,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm<CreateExperienceFormData>({
        resolver: zodResolver(createExperienceSchema),
        mode: 'onChange', // Validate on every change
        defaultValues: {
            category: 'islands',
            allows_children: true,
            child_min_age: 3,
            child_max_age: 9,
            currency: 'COP',
            includes: [],
            excludes: [],
        }
    });

    const allowsChildren = watch('allows_children');

    const validateStep = async (stepToValidate: number) => {
        let fields: (keyof CreateExperienceFormData)[] = [];

        if (stepToValidate === 1) {
            fields = ['title', 'category', 'description'];
        } else if (stepToValidate === 2) {
            fields = ['allows_children'];
            if (allowsChildren) {
                fields.push('child_min_age', 'child_max_age');
            }
        }

        const isValid = await trigger(fields);
        if (isValid) {
            setStep(stepToValidate + 1);
        } else {
            // Optional: scroll to first error
            const errorKeys = Object.keys(errors);
            if (errorKeys.length > 0) {
                import('sonner').then(({ toast }) => {
                    toast.error('Por favor corrige los errores antes de continuar');
                });
            }
        }
    };

    const onInvalid = (errors: FieldErrors<CreateExperienceFormData>) => {
        console.error('Form Validation Errors:', errors);
        const errorValues = Object.values(errors);
        if (errorValues.length > 0) {
            const firstError = errorValues[0];
            if (firstError) {
                import('sonner').then(({ toast }) => {
                    toast.error(`Error en el formulario: ${firstError.message || 'Revisa los campos obligatorios'}`);
                });
            }
        }
    };


    if (isResortLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={ROUTES.DASHBOARD.EXPERIENCES.LIST}>
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Nueva Experiencia
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Configura todos los detalles de tu servicio
                    </p>
                </div>
            </div>

            <StepIndicator currentStep={step} onStepClick={setStep} />

            <form id="experience-form" onSubmit={handleSubmit(submitExperience, onInvalid)}>
                {step === 1 && (
                    <BasicInfoStep
                        register={register}
                        control={control}
                        errors={errors}
                        onNext={() => validateStep(1)}
                    />
                )}


                {step === 2 && (
                    <ChildrenConfigStep
                        register={register}
                        control={control}
                        errors={errors}
                        allowsChildren={allowsChildren}
                        onPrev={() => setStep(1)}
                        onNext={() => validateStep(2)}
                    />
                )}

                {step === 3 && (
                    <ImagesStep
                        images={images}
                        onImagesChange={setImages}
                        onPrev={() => setStep(2)}
                        onNext={() => setStep(4)}
                    />
                )}

                {step === 4 && (
                    <AvailabilityStep
                        blocks={availabilityBlocks}
                        onAddBlock={addBlock}
                        onRemoveBlock={removeBlock}
                        onUpdateBlock={updateBlock}
                        onAddSlot={addSlotToBlock}
                        onRemoveSlot={removeSlotFromBlock}
                        onPrev={() => setStep(3)}
                        isSubmitting={isSubmitting}
                        canSubmit={!!resortId}
                        allowsChildren={allowsChildren}
                    />
                )}
            </form>
        </div>
    );
}
