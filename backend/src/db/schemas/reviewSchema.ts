import z from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().min(1, "Nota mínima é 1").max(5, "Nota máxima é 5"),
  content: z.string().min(1, "Review não pode ser em branco").max(1000, "Review muito longo"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;