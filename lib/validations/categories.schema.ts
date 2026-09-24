import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug cannot exceed 120 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens (e.g. baby-kids)"
    ),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  image_url: z
    .string()
    .trim()
    .refine(
      (val) =>
        !val ||
        val.startsWith("/") ||
        /^https?:\/\//i.test(val) ||
        val.startsWith("data:image/"),
      "Must be a valid image URL or path"
    )
    .optional()
    .or(z.literal("")),
  icon_name: z.string().max(50).optional().or(z.literal("")),
  parent_id: z
    .string()
    .trim()
    .uuid("Invalid parent category ID")
    .nullable()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" || !val ? null : val)),
  display_order: z.coerce.number().int().min(0, "Order must be 0 or greater").default(0),
  is_active: z.boolean().default(true),
});

export const createCategorySchema = categorySchema;

export const updateCategorySchema = categorySchema.extend({
  id: z.uuid("Invalid category ID"),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;
export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;
export type CategoryRecordOutput = z.output<typeof categorySchema>;

