'use client';

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui';
import { ImageUploader, ImageFile } from '@/components/experiences';

interface ImagesStepProps {
    images: ImageFile[];
    onImagesChange: (images: ImageFile[]) => void;
    onPrev: () => void;
    onNext: () => void;
}

export function ImagesStep({ images, onImagesChange, onPrev, onNext }: ImagesStepProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>
                    Sube fotos atractivas de tu experiencia. La primera será la imagen principal.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ImageUploader
                    images={images}
                    onImagesChange={onImagesChange}
                    maxImages={5}
                />

                <div className="flex justify-between">
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
