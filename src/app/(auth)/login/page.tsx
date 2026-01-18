'use client';

import { ROUTES } from '@/routes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Input, PasswordInput } from '@/components/ui';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { AuthError, getErrorMessage } from '@/types/errors';

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, logout } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await login(data);

            // Validate that the user is an admin
            if (user.role !== 'admin') {
                logout();
                setError('Acceso denegado. Solo los administradores pueden acceder a este panel.');
                return;
            }

            router.push(ROUTES.DASHBOARD.HOME);
        } catch (err) {
            const authError = err as AuthError;
            setError(getErrorMessage(authError));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold tracking-tight">Panel de Administración</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Ingresa tus credenciales de administrador para acceder
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="admin@livex.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <div className="space-y-1">
                        <PasswordInput
                            label="Contraseña"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <div className="flex justify-end">
                            <Link
                                href={ROUTES.AUTH.FORGOT_PASSWORD}
                                className="text-sm text-primary hover:text-primary-hover font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                    Iniciar Sesión
                </Button>
            </form>
        </div>
    );
}
