import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useExperienceFormStore } from '@/lib/experience-form-store';
import { useMyResort } from '@/hooks/useResort';
import {
    useCreateExperience,
    useUploadExperienceImages,
    useCreateMultiBlockAvailability,
    transformBlocksToPayload,
} from '@/hooks/useExperience';
import { CreateExperienceFormData } from '@/schemas/experience.schema';
import { ROUTES } from '@/routes';

export function useExperienceForm() {
    const router = useRouter();
    const { resortId, isLoading: isResortLoading, error: resortError } = useMyResort();

    // Store state
    const store = useExperienceFormStore();

    // Mutations
    const createExperience = useCreateExperience();
    const uploadImages = useUploadExperienceImages();
    const createMultiBlockSlots = useCreateMultiBlockAvailability();

    // Computed loading state
    const isSubmitting = createExperience.isPending || uploadImages.isLoading || createMultiBlockSlots.isPending;

    // Handle resort errors
    useEffect(() => {
        if (resortError) {
            toast.error('Error al cargar información del resort');
        }
    }, [resortError]);

    // Redirect if no resort
    useEffect(() => {
        if (!isResortLoading && !resortId) {
            toast.error('No tienes un resort asociado');
            router.push(ROUTES.DASHBOARD.HOME);
        }
    }, [isResortLoading, resortId, router]);

    // Submit the complete experience
    const submitExperience = useCallback(async (data: CreateExperienceFormData) => {
        if (!resortId) {
            toast.error('Resort no encontrado');
            return;
        }

        try {
            // 1. Create experience
            const experience = await createExperience.mutateAsync({ data, resortId });
            const experienceId = experience.id;

            // 2. Upload images (if any)
            if (store.images.length > 0) {
                const uploadResult = await uploadImages.uploadAll(experienceId, store.images);
                if (uploadResult.failed > 0) {
                    toast.warning(`${uploadResult.failed} imagen(es) no se pudieron subir`);
                }
            }

            // 3. Create availability slots using multi-block endpoint
            const blocksWithSlots = store.availabilityBlocks.filter(b => b.slots.length > 0);
            if (blocksWithSlots.length > 0) {
                try {
                    const payload = transformBlocksToPayload(experienceId, blocksWithSlots);
                    const result = await createMultiBlockSlots.mutateAsync(payload);

                    if (result.results.total_created === 0 && result.results.total_skipped > 0) {
                        toast.warning('No se crearon horarios (posibles duplicados)');
                    } else if (result.results.total_created > 0) {
                        toast.success(`${result.results.total_created} horarios creados en ${result.results.blocks_processed} bloque(s)`);
                    }
                } catch {
                    toast.warning('Experiencia creada, pero hubo un error al crear los horarios');
                }
            }

            // Success
            toast.success('Experiencia creada exitosamente');
            store.reset();
            router.push(ROUTES.DASHBOARD.EXPERIENCES.LIST);
        } catch (error: unknown) {
            console.error('Failed to create experience:', error);

            // Extract error message from axios error
            let message = 'Error al crear la experiencia';

            if (error && typeof error === 'object') {
                const axiosError = error as {
                    response?: { data?: { message?: string | string[]; error?: string } };
                    message?: string;
                };

                // Try to get message from response.data.message (NestJS format)
                if (axiosError.response?.data?.message) {
                    const msg = axiosError.response.data.message;
                    message = Array.isArray(msg) ? msg[0] : msg;
                }
                // Try response.data.error
                else if (axiosError.response?.data?.error) {
                    message = axiosError.response.data.error;
                }
                // Fallback to error.message
                else if (axiosError.message) {
                    message = axiosError.message;
                }
            }

            toast.error(message);
        }
    }, [resortId, createExperience, uploadImages, createMultiBlockSlots, store, router]);

    return {
        // Resort
        resortId,
        isResortLoading,

        // Form state from store
        images: store.images,
        setImages: store.setImages,

        // Availability blocks (new multi-block system)
        availabilityBlocks: store.availabilityBlocks,
        addBlock: store.addBlock,
        removeBlock: store.removeBlock,
        updateBlock: store.updateBlock,
        addSlotToBlock: store.addSlotToBlock,
        removeSlotFromBlock: store.removeSlotFromBlock,

        // Steps
        step: store.step,
        setStep: store.setStep,
        nextStep: store.nextStep,
        prevStep: store.prevStep,

        // Actions
        submitExperience,
        isSubmitting,
        reset: store.reset,
    };
}
