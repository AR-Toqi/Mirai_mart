import { z } from "zod";

export const promotionDiscountTypeSchema = z.enum([
  "percentage",
  "fixed_amount",
  "free_shipping",
]);

export const createPromotionSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Coupon code must be at least 2 characters")
      .max(50, "Coupon code cannot exceed 50 characters")
      .regex(
        /^[A-Z0-9_-]+$/i,
        "Coupon code can only contain letters, numbers, hyphens, and underscores."
      )
      .transform((val) => val.toUpperCase()),
    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters")
      .nullish()
      .transform((val) => val || null),
    discount_type: promotionDiscountTypeSchema,
    discount_value: z
      .number({ error: "Discount value must be a number" })
      .min(0, "Discount value cannot be negative"),
    min_order_value: z
      .number({ error: "Minimum order value must be a number" })
      .min(0, "Minimum order value cannot be negative")
      .default(0),
    max_uses: z
      .number()
      .int()
      .min(0, "Maximum uses cannot be negative")
      .nullish()
      .transform((val) => (val && val > 0 ? val : null)),
    starts_at: z
      .string()
      .datetime({ offset: true })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .nullish()
      .transform((val) => val || null),
    expires_at: z
      .string()
      .datetime({ offset: true })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .nullish()
      .transform((val) => val || null),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.discount_type === "percentage") {
        return data.discount_value > 0 && data.discount_value <= 100;
      }
      if (data.discount_type === "fixed_amount") {
        return data.discount_value > 0;
      }
      return true;
    },
    {
      message: "Percentage discount must be between 1% and 100%, and fixed amount must be > ৳0.",
      path: ["discount_value"],
    }
  )
  .refine(
    (data) => {
      if (data.starts_at && data.expires_at) {
        return new Date(data.expires_at) >= new Date(data.starts_at);
      }
      return true;
    },
    {
      message: "Expiration date cannot be earlier than start date.",
      path: ["expires_at"],
    }
  );

export type CreatePromotionSchema = z.infer<typeof createPromotionSchema>;
export type CreatePromotionInput = z.input<typeof createPromotionSchema>;

export const updatePromotionSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Coupon code must be at least 2 characters")
      .max(50, "Coupon code cannot exceed 50 characters")
      .regex(
        /^[A-Z0-9_-]+$/i,
        "Coupon code can only contain letters, numbers, hyphens, and underscores."
      )
      .transform((val) => val.toUpperCase())
      .optional(),
    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters")
      .nullish(),
    discount_type: promotionDiscountTypeSchema.optional(),
    discount_value: z
      .number()
      .min(0, "Discount value cannot be negative")
      .optional(),
    min_order_value: z
      .number()
      .min(0, "Minimum order value cannot be negative")
      .optional(),
    max_uses: z
      .number()
      .int()
      .min(0, "Maximum uses cannot be negative")
      .nullish()
      .transform((val) => (val && val > 0 ? val : null)),
    starts_at: z
      .string()
      .datetime({ offset: true })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .nullish()
      .transform((val) => val || null),
    expires_at: z
      .string()
      .datetime({ offset: true })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .nullish()
      .transform((val) => val || null),
    is_active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.discount_type === "percentage" && data.discount_value !== undefined) {
        return data.discount_value > 0 && data.discount_value <= 100;
      }
      if (data.discount_type === "fixed_amount" && data.discount_value !== undefined) {
        return data.discount_value > 0;
      }
      return true;
    },
    {
      message: "Percentage discount must be between 1% and 100%, and fixed amount must be > ৳0.",
      path: ["discount_value"],
    }
  )
  .refine(
    (data) => {
      if (data.starts_at && data.expires_at) {
        return new Date(data.expires_at) >= new Date(data.starts_at);
      }
      return true;
    },
    {
      message: "Expiration date cannot be earlier than start date.",
      path: ["expires_at"],
    }
  );

export type UpdatePromotionSchema = z.infer<typeof updatePromotionSchema>;
export type UpdatePromotionInput = z.input<typeof updatePromotionSchema>;
