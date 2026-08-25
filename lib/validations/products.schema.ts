import { z } from "zod";

export const sortOptionsSchema = z.enum([
  "featured",
  "price_asc",
  "price_desc",
  "rating",
  "newest",
]);

export type SortOption = z.infer<typeof sortOptionsSchema>;

export const productFilterSchema = z.object({
  category: z.string().optional(),
  subCategory: z.string().optional(),
  minPrice: z.coerce.number().min(0).default(0),
  maxPrice: z.coerce.number().min(0).default(10000),
  ageRanges: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }),
  tags: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }),
  inStockOnly: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true" || val === "1";
    }),
  sort: sortOptionsSchema.default("featured"),
  query: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ProductFilterInput = z.infer<typeof productFilterSchema>;

export const searchRequestSchema = z.object({
  q: z.string().trim().min(1, "Search query is required"),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(6),
});

export type SearchRequestInput = z.infer<typeof searchRequestSchema>;
