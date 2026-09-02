import { z } from "zod";

export const submitReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productSlug: z.string().min(1, "Product slug is required"),
  productTitle: z.string().min(1, "Product title is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  comment: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review cannot exceed 2000 characters"),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
