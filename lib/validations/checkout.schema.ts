import { z } from "zod";

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  phone: z
    .string()
    .regex(
      /^(?:\+8801|8801|01)[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi mobile number (e.g. 01712345678)"
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .or(z.literal(""))
    .optional()
    .default(""),
  deliveryZone: z.enum(["inside_dhaka", "outside_dhaka"], {
    message: "Please select a delivery zone",
  }),
  addressLine1: z
    .string()
    .min(5, "Please provide complete street/house address")
    .max(250, "Address is too long"),
  city: z.string().optional().default("Bangladesh"),
  postalCode: z.string().optional(),
  orderNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  paymentMode: z.enum(["cod_advance", "full_payment"], {
    message: "Please select a payment mode",
  }),
  mfsProvider: z.enum(["bkash", "nagad"], {
    message: "Please select bKash or Nagad",
  }),
  senderNumber: z
    .string()
    .regex(
      /^(?:\+8801|8801|01)[3-9]\d{8}$/,
      "Please enter the sender bKash/Nagad mobile number (e.g. 017XXXXXXXX)"
    ),
  transactionId: z
    .string()
    .trim()
    .min(4, "Transaction ID (TrxID) is required")
    .max(40, "Transaction ID is too long"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the website terms and conditions",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const checkoutCartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullish(),
  productTitle: z.string(),
  variantTitle: z.string().nullish(),
  productSlug: z.string(),
  sku: z.string().nullish(),
  price: z.number().positive(),
  compareAtPrice: z.number().nullish(),
  quantity: z.number().int().positive(),
  imageUrl: z.string(),
});

export const orderPlacementPayloadSchema = z.object({
  formData: checkoutFormSchema,
  items: z.array(checkoutCartItemSchema).min(1, "Your cart is empty"),
  giftOptions: z
    .object({
      isGift: z.boolean().default(false),
      wrapFee: z.number().default(0),
      message: z.string().optional(),
    })
    .optional(),
  appliedPromoCode: z.string().optional(),
});

export type OrderPlacementPayload = z.infer<typeof orderPlacementPayloadSchema>;
