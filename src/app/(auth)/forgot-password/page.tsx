'use client';

import { ROUTES } from '@/routes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthError, getErrorMessage } from '@/types/errors';

const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const { requestPasswordReset } = useAuthStore();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setStatus('loading');
        setErrorMessage(null);
        try {
            await requestPasswordReset(data.email);
            setStatus('success');
        } catch (err) {
            const authError = err as AuthError;
            setStatus('error');
            setErrorMessage(getErrorMessage(authError));
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Correo enviado</h2>
                    <p className="text-muted-foreground">
                        Hemos enviado un código de 6 dígitos a tu correo electrónico.
                        Úsalo para restablecer tu contraseña.
                    </p>
                </div>
                <div className="pt-4 space-y-3">
                    <Link href={ROUTES.AUTH.RESET_PASSWORD}>
                        <Button className="w-full">
                            Tengo el código
                        </Button>
                    </Link>
                    <Link href={ROUTES.AUTH.LOGIN}>
                        <Button variant="outline" className="w-full">
                            Volver al inicio de sesión
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h2>
                <p className="text-sm text-muted-foreground">
                    Ingresa tu email y te enviaremos un código para restablecerla
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {status === 'error' && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                </div>

                <Button type="submit" className="w-full" isLoading={status === 'loading'} size="lg">
                    Enviar código
                </Button>

                <div className="text-center text-sm">
                    <Link
                        href={ROUTES.AUTH.LOGIN}
                        className="font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </form>
        </div>
    );
}
