import { create } from 'zustand';
import { ImageFile } from '@/components/experiences';
import { TimeSlotConfig } from '@/schemas/experience.schema';

// Temporada (bloque de disponibilidad con precios obligatorios)
export interface SeasonBlock {
    id: string;
    startDate: string;
    endDate: string;
    defaultCapacity: number;
    slots: TimeSlotConfig[];
    // Precios de temporada (OBLIGATORIOS)
    pricePerAdult: number;
    pricePerChild: number;
    commissionPerAdult: number;
    commissionPerChild: number;
}

// Legacy alias
export type AvailabilityBlock = SeasonBlock;

interface ExperienceFormState {
    // Images state
    images: ImageFile[];
    setImages: (images: ImageFile[]) => void;
    addImage: (image: ImageFile) => void;
    removeImage: (index: number) => void;

    // Availability blocks (multiple date ranges with independent slots)
    availabilityBlocks: AvailabilityBlock[];
    addBlock: () => void;
    removeBlock: (blockId: string) => void;
    updateBlock: (blockId: string, updates: Partial<Omit<AvailabilityBlock, 'id'>>) => void;
    addSlotToBlock: (blockId: string, slot: TimeSlotConfig) => void;
    removeSlotFromBlock: (blockId: string, slotIndex: number) => void;

    // Form step
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Reset all state
    reset: () => void;
}

const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getDefaultDates = () => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
        start: today.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
    };
};

const createDefaultBlock = (): SeasonBlock => {
    const dates = getDefaultDates();
    return {
        id: generateBlockId(),
        startDate: dates.start,
        endDate: dates.end,
        defaultCapacity: 10,
        slots: [],
        // Precios obligatorios - el usuario debe llenarlos
        pricePerAdult: 0,
        pricePerChild: 0,
        commissionPerAdult: 0,
        commissionPerChild: 0,
    };
};

const initialState = {
    images: [] as ImageFile[],
    availabilityBlocks: [createDefaultBlock()],
    step: 1,
};

export const useExperienceFormStore = create<ExperienceFormState>((set) => ({
    ...initialState,

    // Images
    setImages: (images) => set({ images }),
    addImage: (image) => set((state) => ({ images: [...state.images, image] })),
    removeImage: (index) => set((state) => {
        const newImages = [...state.images];
        if (newImages[index]?.preview) {
            URL.revokeObjectURL(newImages[index].preview);
        }
        newImages.splice(index, 1);
        return { images: newImages };
    }),

    // Availability Blocks
    addBlock: () => set((state) => ({
        availabilityBlocks: [...state.availabilityBlocks, createDefaultBlock()]
    })),

    removeBlock: (blockId) => set((state) => ({
        availabilityBlocks: state.availabilityBlocks.filter(b => b.id !== blockId)
    })),

    updateBlock: (blockId, updates) => set((state) => ({
        availabilityBlocks: state.availabilityBlocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
        )
    })),

    addSlotToBlock: (blockId, slot) => set((state) => ({
        availabilityBlocks: state.availabilityBlocks.map(block =>
            block.id === blockId
                ? { ...block, slots: [...block.slots, slot] }
                : block
        )
    })),

    removeSlotFromBlock: (blockId, slotIndex) => set((state) => ({
        availabilityBlocks: state.availabilityBlocks.map(block => {
            if (block.id !== blockId) return block;
            const newSlots = [...block.slots];
            newSlots.splice(slotIndex, 1);
            return { ...block, slots: newSlots };
        })
    })),

    // Steps
    setStep: (step) => set({ step }),
    nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
    prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

    // Reset
    reset: () => {
        set((state) => {
            state.images.forEach(img => {
                if (img.preview) URL.revokeObjectURL(img.preview);
            });
            return {
                images: [],
                availabilityBlocks: [createDefaultBlock()],
                step: 1,
            };
        });
    },
}));
