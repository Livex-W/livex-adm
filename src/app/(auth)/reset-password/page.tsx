'use client';

import { ROUTES } from '@/routes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button, Input, PasswordInput } from '@/components/ui';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthError, getErrorMessage } from '@/types/errors';

// Password regex: 8+ chars, uppercase, lowercase, numbers
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const resetPasswordSchema = z.object({
    token: z.string().length(6, 'El código debe tener 6 dígitos'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(PASSWORD_REGEX, 'Debe incluir mayúsculas, minúsculas y números'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const { resetPassword } = useAuthStore();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const tokenFromURL = searchParams.get('token') || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: tokenFromURL,
        },
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        setStatus('loading');
        setErrorMessage(null);
        try {
            await resetPassword(data.token, data.password);
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
                    <h2 className="text-2xl font-semibold tracking-tight">¡Contraseña actualizada!</h2>
                    <p className="text-muted-foreground">
                        Tu contraseña ha sido restablecida exitosamente.
                        Ahora puedes iniciar sesión con tu nueva contraseña.
                    </p>
                </div>
                <div className="pt-4">
                    <Link href={ROUTES.AUTH.LOGIN}>
                        <Button className="w-full">
                            Ir a iniciar sesión
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Restablecer contraseña</h2>
                <p className="text-sm text-muted-foreground">
                    Ingresa el código de 6 dígitos que recibiste por correo y tu nueva contraseña
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
                        label="Código de verificación"
                        placeholder="123456"
                        maxLength={6}
                        error={errors.token?.message}
                        {...register('token')}
                    />

                    <PasswordInput
                        label="Nueva contraseña"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        helperText="Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números"
                        {...register('password')}
                    />

                    <PasswordInput
                        label="Confirmar nueva contraseña"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>

                <Button type="submit" className="w-full" isLoading={status === 'loading'} size="lg">
                    Restablecer contraseña
                </Button>

                <div className="text-center text-sm space-y-2">
                    <Link
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className="font-medium text-muted-foreground hover:text-primary transition-colors block"
                    >
                        ¿No recibiste el código? Solicitar otro
                    </Link>
                    <Link
                        href={ROUTES.AUTH.LOGIN}
                        className="font-medium text-muted-foreground hover:text-primary transition-colors block"
                    >
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="animate-pulse">Cargando...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
