import { z } from 'zod';

// Create agent schema
export const createAgentSchema = z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    phone: z.string().optional(),
    commissionPercentage: z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => val >= 0 && val <= 100, 'La comisión debe estar entre 0 y 100'),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;
