"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { PromotionRecord } from "@/lib/db/types";
import { VALID_PROMO_CODES } from "@/lib/constants";
import {
  createPromotionSchema,
  updatePromotionSchema,
  type CreatePromotionInput,
  type UpdatePromotionInput,
} from "@/lib/validations/promotion.schema";

export type { CreatePromotionInput, UpdatePromotionInput };

export interface ValidatePromoCodeResult {
  success: boolean;
  message: string;
  promo?: {
    code: string;
    discountType: "percentage" | "fixed_amount" | "free_shipping";
    discountValue: number;
    discountAmount: number;
    minOrderValue: number;
    description: string;
  };
}

// Fallback baseline promotions in case DB table is empty or hydrating
const BASELINE_PROMOTIONS: PromotionRecord[] = [
  {
    id: "d0111111-1111-1111-1111-111111111111",
    code: "MIRAI10",
    description: "Enjoy 10% off your entire curated order.",
    discount_type: "percentage",
    discount_value: 10,
    min_order_value: 500,
    max_uses: 1000,
    used_count: 247,
    starts_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-12-31T23:59:59Z",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "d0222222-2222-2222-2222-222222222222",
    code: "FREESHIP",
    description: "Free standard delivery across Bangladesh for orders over ৳ 999.",
    discount_type: "free_shipping",
    discount_value: 0,
    min_order_value: 999,
    max_uses: null,
    used_count: 142,
    starts_at: "2026-01-01T00:00:00Z",
    expires_at: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "d0333333-3333-3333-3333-333333333333",
    code: "WELCOME200",
    description: "Flat ৳ 200 discount for first-time account registration.",
    discount_type: "fixed_amount",
    discount_value: 200,
    min_order_value: 1500,
    max_uses: 500,
    used_count: 89,
    starts_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-10-31T23:59:59Z",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "d0444444-4444-4444-4444-444444444444",
    code: "SUPERKIDS15",
    description: "Special 15% discount on educational toys and montessori kits.",
    discount_type: "percentage",
    discount_value: 15,
    min_order_value: 1200,
    max_uses: 200,
    used_count: 198,
    starts_at: "2026-06-01T00:00:00Z",
    expires_at: "2026-09-30T23:59:59Z",
    is_active: true,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "d0555555-5555-5555-5555-555555555555",
    code: "FLASH50",
    description: "Flat ৳ 50 off on flash gadget deals.",
    discount_type: "fixed_amount",
    discount_value: 50,
    min_order_value: 300,
    max_uses: 300,
    used_count: 300,
    starts_at: "2026-08-01T00:00:00Z",
    expires_at: "2026-09-01T00:00:00Z",
    is_active: false,
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
];

/**
 * Fetch all promotions for the Admin CMS
 */
export async function getAdminPromotionsAction(): Promise<{
  success: boolean;
  promotions: PromotionRecord[];
  error?: string;
}> {
  try {
    const insforge = await createInsforgeServer();
    const { data, error } = await insforge.database
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[getAdminPromotionsAction] Error fetching DB promotions:", error);
      return { success: true, promotions: BASELINE_PROMOTIONS };
    }

    if (!data || !Array.isArray(data)) {
      return { success: true, promotions: BASELINE_PROMOTIONS };
    }

    // When DB has records, treat DB as the single source of truth
    if (data.length > 0) {
      return {
        success: true,
        promotions: data as PromotionRecord[],
      };
    }

    // If DB returned an empty list, respect it so deleted promotions stay deleted
    return {
      success: true,
      promotions: [],
    };
  } catch (err: unknown) {
    console.error("[getAdminPromotionsAction] Fatal error:", err);
    return {
      success: true,
      promotions: BASELINE_PROMOTIONS,
    };
  }
}

/**
 * Create a new promotion in the database
 */
export async function createAdminPromotionAction(
  input: CreatePromotionInput
): Promise<{
  success: boolean;
  promotion?: PromotionRecord;
  error?: string;
}> {
  try {
    const parseResult = createPromotionSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message || "Invalid promotion data.",
      };
    }
    const validData = parseResult.data;

    const insforge = await createInsforgeServer();

    // Check code uniqueness
    const { data: existing } = await insforge.database
      .from("promotions")
      .select("id")
      .eq("code", validData.code)
      .limit(1);

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: `Promo code "${validData.code}" already exists. Please choose a different code.`,
      };
    }

    const newRecord = {
      code: validData.code,
      description: validData.description,
      discount_type: validData.discount_type,
      discount_value: validData.discount_value,
      min_order_value: validData.min_order_value,
      max_uses: validData.max_uses,
      used_count: 0,
      starts_at: validData.starts_at,
      expires_at: validData.expires_at,
      is_active: validData.is_active,
    };

    const { data: inserted, error: insertError } = await insforge.database
      .from("promotions")
      .insert([newRecord])
      .select("*")
      .single();

    if (insertError) {
      console.error("[createAdminPromotionAction] Insert error:", insertError);
      return { success: false, error: insertError.message || "Failed to create promotion in database." };
    }

    revalidatePath("/admin/promos");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      success: true,
      promotion: inserted as PromotionRecord,
    };
  } catch (err: unknown) {
    console.error("[createAdminPromotionAction] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create promotion.",
    };
  }
}

/**
 * Update an existing promotion
 */
export async function updateAdminPromotionAction(
  id: string,
  input: UpdatePromotionInput
): Promise<{
  success: boolean;
  promotion?: PromotionRecord;
  error?: string;
}> {
  try {
    const parseResult = updatePromotionSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message || "Invalid promotion data.",
      };
    }
    const validData = parseResult.data;

    const insforge = await createInsforgeServer();

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (validData.code !== undefined) {
      // Verify code uniqueness if being changed
      const { data: duplicate } = await insforge.database
        .from("promotions")
        .select("id")
        .eq("code", validData.code)
        .neq("id", id)
        .limit(1);

      if (duplicate && duplicate.length > 0) {
        return {
          success: false,
          error: `Promo code "${validData.code}" already exists for another promotion.`,
        };
      }
      updatePayload.code = validData.code;
    }
    if (validData.description !== undefined) {
      updatePayload.description = validData.description;
    }
    if (validData.discount_type !== undefined) {
      updatePayload.discount_type = validData.discount_type;
    }
    if (validData.discount_value !== undefined) {
      updatePayload.discount_value = validData.discount_value;
    }
    if (validData.min_order_value !== undefined) {
      updatePayload.min_order_value = validData.min_order_value;
    }
    if (validData.max_uses !== undefined) {
      updatePayload.max_uses = validData.max_uses;
    }
    if (validData.starts_at !== undefined) {
      updatePayload.starts_at = validData.starts_at;
    }
    if (validData.expires_at !== undefined) {
      updatePayload.expires_at = validData.expires_at;
    }
    if (validData.is_active !== undefined) {
      updatePayload.is_active = validData.is_active;
    }

    const { data: updated, error } = await insforge.database
      .from("promotions")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      // If record not in DB yet (e.g. initial baseline seed item), attempt upsert with baseline default
      const baseline = BASELINE_PROMOTIONS.find((b) => b.id === id);
      if (baseline) {
        const seedMerged = {
          ...baseline,
          ...updatePayload,
          id: baseline.id,
        };
        const { data: upserted, error: upsertErr } = await insforge.database
          .from("promotions")
          .upsert([seedMerged])
          .select("*")
          .single();

        if (!upsertErr && upserted) {
          revalidatePath("/admin/promos");
          revalidatePath("/cart");
          revalidatePath("/checkout");
          return { success: true, promotion: upserted as PromotionRecord };
        }
      }

      console.error("[updateAdminPromotionAction] Update error:", error);
      return { success: false, error: error.message || "Failed to update promotion." };
    }

    revalidatePath("/admin/promos");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      success: true,
      promotion: updated as PromotionRecord,
    };
  } catch (err: unknown) {
    console.error("[updateAdminPromotionAction] Fatal error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update promotion.",
    };
  }
}

/**
 * Toggle active status of a promotion
 */
export async function toggleAdminPromotionStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const insforge = await createInsforgeServer();
    const { error } = await insforge.database
      .from("promotions")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      const baseline = BASELINE_PROMOTIONS.find((b) => b.id === id);
      if (baseline) {
        const seed = {
          ...baseline,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        };
        const { error: upsertErr } = await insforge.database
          .from("promotions")
          .upsert([seed]);
        if (!upsertErr) {
          revalidatePath("/admin/promos");
          revalidatePath("/cart");
          revalidatePath("/checkout");
          return { success: true };
        }
      }

      console.error("[toggleAdminPromotionStatusAction] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/promos");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: unknown) {
    console.error("[toggleAdminPromotionStatusAction] Fatal:", err);
    return { success: false, error: err instanceof Error ? err.message : "Toggle failed" };
  }
}

/**
 * Delete a promotion from database
 */
export async function deleteAdminPromotionAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const insforge = await createInsforgeServer();
    const { error } = await insforge.database
      .from("promotions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteAdminPromotionAction] Delete error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/promos");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteAdminPromotionAction] Fatal:", err);
    return { success: false, error: err instanceof Error ? err.message : "Deletion failed" };
  }
}

/**
 * Real-time coupon code validation for Cart & Checkout
 */
export async function validatePromoCodeAction(
  code: string,
  currentSubtotal: number
): Promise<ValidatePromoCodeResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: "Please enter a promo code." };
  }

  try {
    const insforge = await createInsforgeServer();
    let record: PromotionRecord | null = null;

    let dbQuerySucceeded = false;

    // 1. Query database
    try {
      const { data, error } = await insforge.database
        .from("promotions")
        .select("*")
        .eq("code", cleanCode)
        .limit(1);

      if (!error) {
        dbQuerySucceeded = true;
        if (data && data.length > 0) {
          record = data[0] as PromotionRecord;
        }
      }
    } catch (dbErr) {
      console.warn("[validatePromoCodeAction] DB query failed, checking fallbacks:", dbErr);
    }

    // 2. Check baseline seed promotions ONLY if DB query failed (e.g. offline/disconnected)
    if (!record && !dbQuerySucceeded) {
      const fallback = BASELINE_PROMOTIONS.find((b) => b.code.toUpperCase() === cleanCode);
      if (fallback) {
        record = fallback;
      }
    }

    // 3. Check legacy static dictionary as ultimate fallback
    if (!record) {
      const legacy = VALID_PROMO_CODES[cleanCode];
      if (legacy) {
        record = {
          id: `legacy-${cleanCode}`,
          code: cleanCode,
          description: legacy.description,
          discount_type: legacy.type,
          discount_value: legacy.value,
          min_order_value: legacy.minSubtotal,
          max_uses: null,
          used_count: 0,
          starts_at: null,
          expires_at: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    if (!record) {
      return { success: false, message: `Promo code "${cleanCode}" is invalid.` };
    }

    // 4. Validate active status
    if (!record.is_active) {
      return { success: false, message: `Promo code "${cleanCode}" is currently inactive.` };
    }

    const now = new Date();

    // 5. Validate start date
    if (record.starts_at) {
      const startDate = new Date(record.starts_at);
      if (now < startDate) {
        return {
          success: false,
          message: `Promo code "${cleanCode}" will become active on ${startDate.toLocaleDateString()}.`,
        };
      }
    }

    // 6. Validate expiration date
    if (record.expires_at) {
      const expiryDate = new Date(record.expires_at);
      if (now > expiryDate) {
        return {
          success: false,
          message: `Promo code "${cleanCode}" expired on ${expiryDate.toLocaleDateString()}.`,
        };
      }
    }

    // 7. Validate usage cap
    const usedCount = record.used_count ?? 0;
    if (record.max_uses && record.max_uses > 0 && usedCount >= record.max_uses) {
      return {
        success: false,
        message: `Promo code "${cleanCode}" has reached its maximum redemption limit.`,
      };
    }

    // 8. Validate minimum order subtotal
    const minOrderVal = record.min_order_value ?? 0;
    if (currentSubtotal < minOrderVal) {
      return {
        success: false,
        message: `Minimum subtotal of ৳ ${minOrderVal.toLocaleString()} required for code "${cleanCode}".`,
      };
    }

    // 9. Calculate discount amount
    let discountAmount = 0;
    if (record.discount_type === "percentage") {
      discountAmount = Math.round((currentSubtotal * record.discount_value) / 100);
    } else if (record.discount_type === "fixed_amount") {
      discountAmount = Math.min(currentSubtotal, record.discount_value);
    } else if (record.discount_type === "free_shipping") {
      discountAmount = 0; // Handled in shipping fee deduction
    }

    return {
      success: true,
      message: `Promo code "${cleanCode}" applied successfully!`,
      promo: {
        code: cleanCode,
        discountType: record.discount_type,
        discountValue: record.discount_value,
        discountAmount,
        minOrderValue: record.min_order_value || 0,
        description: record.description || `${cleanCode} discount applied`,
      },
    };
  } catch (err: unknown) {
    console.error("[validatePromoCodeAction] Validation error:", err);
    return {
      success: false,
      message: "An unexpected error occurred while validating promo code.",
    };
  }
}

/**
 * Increment promotion usage count when an order is successfully created
 */
export async function incrementPromotionUsageAction(code: string): Promise<void> {
  try {
    const cleanCode = code.trim().toUpperCase();
    const insforge = await createInsforgeServer();

    const { data } = await insforge.database
      .from("promotions")
      .select("id, used_count")
      .eq("code", cleanCode)
      .limit(1);

    if (data && data.length > 0) {
      const record = data[0];
      const newCount = (record.used_count || 0) + 1;
      await insforge.database
        .from("promotions")
        .update({ used_count: newCount, updated_at: new Date().toISOString() })
        .eq("id", record.id);
    }
  } catch (err) {
    console.warn("[incrementPromotionUsageAction] Note:", err);
  }
}
