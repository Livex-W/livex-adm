import { z } from 'zod';
import { nitSchema } from './nit.schema';

export const createAgentSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    documentType: z.enum(['CC', 'NIT', 'CE', 'PASSPORT'], {
        message: 'Selecciona el tipo de documento',
    }),
    documentNumber: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
    email: z.email('Email inválido'),
    phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    nit: z.string().optional().or(z.literal(''))
        .refine(val => {
            if (!val) return true;
            return nitSchema.safeParse(val).success;
        }, { message: 'El NIT no es válido o el dígito de verificación no coincide.' }),
    rnt: z.string().optional()
        .refine(val => !val || /^\d{5}$/.test(val), { message: 'El RNT debe tener exactamente 5 dígitos' }),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;
