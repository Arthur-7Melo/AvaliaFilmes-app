import z from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().min(1, "Nota mínima é 1").max(5, "Nota máxima é 5"),
  content: z.string().min(1, "Review não pode ser em branco").max(1000, "Review muito longo"),
});

export const updateReviewSchema = z.object({
  rating: z.number()
    .min(1, "Nota mínima é 1").max(5, "Nota máxima é 5")
    .optional(),
  content: z.string()
    .min(1, "Review não pode ser em branco").max(1000, "Review muito longo")
    .optional(),
});

export const reviewIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de review inválido"),
});


export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;