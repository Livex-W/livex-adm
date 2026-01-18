'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageFile {
    file: File;
    preview: string;
    uploading?: boolean;
    uploaded?: boolean;
    url?: string;
}

interface ImageUploaderProps {
    images: ImageFile[];
    onImagesChange: (images: ImageFile[]) => void;
    maxImages?: number;
    className?: string;
}

export function ImageUploader({
    images,
    onImagesChange,
    maxImages = 5,
    className
}: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        const newImages: ImageFile[] = [];
        const remainingSlots = maxImages - images.length;

        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                newImages.push({
                    file,
                    preview: URL.createObjectURL(file),
                });
            }
        }

        if (newImages.length > 0) {
            onImagesChange([...images, ...newImages]);
        }
    }, [images, maxImages, onImagesChange]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const removeImage = useCallback((index: number) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    const canAddMore = images.length < maxImages;

    return (
        <div className={cn("space-y-4", className)}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Imágenes ({images.length}/{maxImages})
            </label>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden group"
                        >
                            <Image
                                src={img.preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            {index === 0 && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-indigo-600 text-white rounded">
                                    Principal
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            {img.uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Drop Zone */}
            {canAddMore && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        `
                        border-2 border-dashed rounded-lg p-8
                        flex flex-col items-center justify-center gap-3
                        cursor-pointer transition-colors
                        `,
                        dragActive
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                    )}
                >
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                        {dragActive ? (
                            <Upload className="h-6 w-6 text-indigo-500" />
                        ) : (
                            <ImageIcon className="h-6 w-6 text-slate-500" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Arrastra imágenes aquí
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            o haz clic para seleccionar
                        </p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                </div>
            )}
        </div>
    );
}

export type { ImageFile };
