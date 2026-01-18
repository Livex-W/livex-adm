'use client';

import React, { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    description,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
}: ModalProps) {
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl',
    };

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={cn(
                    `
          relative w-full
          bg-white dark:bg-slate-900
          rounded-2xl shadow-2xl
          max-h-[90vh] overflow-hidden
          flex flex-col
          animate-in fade-in zoom-in-95 duration-200
        `,
                    sizes[size]
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-xl font-semibold text-slate-900 dark:text-slate-100"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {description}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
}

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800',
                className
            )}
        >
            {children}
        </div>
    );
}
