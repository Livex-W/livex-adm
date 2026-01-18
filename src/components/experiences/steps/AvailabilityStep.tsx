'use client';

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui';
import { AvailabilityBlockConfigurator } from '@/components/experiences';
import { Save } from 'lucide-react';
import { AvailabilityBlock } from '@/lib/experience-form-store';
import { TimeSlotConfig } from '@/schemas/experience.schema';

interface AvailabilityStepProps {
    blocks: AvailabilityBlock[];
    onAddBlock: () => void;
    onRemoveBlock: (blockId: string) => void;
    onUpdateBlock: (blockId: string, updates: Partial<Omit<AvailabilityBlock, 'id'>>) => void;
    onAddSlot: (blockId: string, slot: TimeSlotConfig) => void;
    onRemoveSlot: (blockId: string, slotIndex: number) => void;
    onPrev: () => void;
    isSubmitting: boolean;
    canSubmit: boolean;
}

export function AvailabilityStep({
    blocks,
    onAddBlock,
    onRemoveBlock,
    onUpdateBlock,
    onAddSlot,
    onRemoveSlot,
    onPrev,
    isSubmitting,
    canSubmit,
    allowsChildren = true,
}: AvailabilityStepProps & { allowsChildren?: boolean }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Temporadas y Disponibilidad</CardTitle>
                <CardDescription>
                    Configura tus temporadas, define sus precios obligatorios y sus horarios.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <AvailabilityBlockConfigurator
                    blocks={blocks}
                    onAddBlock={onAddBlock}
                    onRemoveBlock={onRemoveBlock}
                    onUpdateBlock={onUpdateBlock}
                    onAddSlot={onAddSlot}
                    onRemoveSlot={onRemoveSlot}
                    allowsChildren={allowsChildren}
                />

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onPrev}>
                        Anterior
                    </Button>
                    <Button
                        type="submit"
                        form="experience-form"
                        size="lg"
                        isLoading={isSubmitting}
                        leftIcon={<Save className="h-4 w-4" />}
                        disabled={!canSubmit}
                    >
                        Crear Experiencia
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
