"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import posthog from "posthog-js";
import type { CartItem, CartGiftOptions, AppliedPromo } from "@/types";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  GIFT_WRAP_PRICE,
  VALID_PROMO_CODES,
} from "@/lib/constants";

const CART_STORAGE_KEY = "mirai_mart_cart_v1";

import { useAuth } from "@/components/providers/AuthProvider";
import { insforge } from "@/lib/insforge-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CartContextType {
  items: CartItem[];
  selectedItems: CartItem[];
  selectedItemIds: string[];
  giftOptions: CartGiftOptions;
  appliedPromo: AppliedPromo | null;
  isCartDrawerOpen: boolean;
  isHydrated: boolean;

  // Computed metrics
  itemCount: number;
  selectedCount: number;
  subtotal: number;
  selectedSubtotal: number;
  rawSavings: number;
  shippingFee: number;
  giftWrapFee: number;
  discountAmount: number;
  grandTotal: number;
  isFreeShippingEligible: boolean;
  freeShippingRemaining: number;
  freeShippingProgress: number;

  // Action methods
  addItem: (
    item: Omit<CartItem, "id">,
    options?: { openDrawer?: boolean; quantity?: number }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelectItem: (itemId: string) => void;
  toggleSelectAll: (select?: boolean) => void;
  toggleGiftWrap: (enabled?: boolean) => void;
  setGiftMessage: (message: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialGiftOptions: CartGiftOptions = {
  isGift: false,
  wrapFee: GIFT_WRAP_PRICE,
  message: "",
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [giftOptions, setGiftOptions] = useState<CartGiftOptions>(initialGiftOptions);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [hasMergedRemote, setHasMergedRemote] = useState<boolean>(false);

  // 1. Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items);
          if (Array.isArray(parsed.selectedItemIds)) {
            setSelectedItemIds(parsed.selectedItemIds);
          } else {
            setSelectedItemIds(parsed.items.map((i: CartItem) => i.id));
          }
        }
        if (parsed.giftOptions && typeof parsed.giftOptions.isGift === "boolean") {
          setGiftOptions(parsed.giftOptions);
        }
        if (parsed.appliedPromo) {
          setAppliedPromo(parsed.appliedPromo);
        }
      }
    } catch (err) {
      console.error("[CartProvider] Failed to hydrate cart from localStorage", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. TanStack Query: Fetch user profile active_cart from InsForge DB on login
  const { data: remoteCartProfile } = useQuery({
    queryKey: ["user-active-cart", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await insforge.database
        .from("profiles")
        .select("active_cart")
        .eq("id", user.id)
        .single();
      if (error) {
        console.warn("[CartProvider/TanStack] Could not fetch remote cart:", error.message);
        return null;
      }
      return data;
    },
    enabled: isHydrated && isAuthenticated && !!user?.id && !hasMergedRemote,
    staleTime: 5 * 60 * 1000,
  });

  // Merge remote cart items with local cart items on initial login resolution
  useEffect(() => {
    if (!remoteCartProfile?.active_cart || hasMergedRemote) return;

    const remote = remoteCartProfile.active_cart as {
      items?: CartItem[];
      selectedItemIds?: string[];
      giftOptions?: CartGiftOptions;
      appliedPromo?: AppliedPromo | null;
    };

    if (Array.isArray(remote.items) && remote.items.length > 0) {
      setItems((localItems) => {
        const mergedMap = new Map<string, CartItem>();

        // Add remote items
        remote.items?.forEach((ri) => {
          mergedMap.set(ri.id, ri);
        });

        // Merge local items (preserving higher quantity and local additions)
        localItems.forEach((li) => {
          if (mergedMap.has(li.id)) {
            const existing = mergedMap.get(li.id)!;
            mergedMap.set(li.id, {
              ...existing,
              quantity: Math.min(
                li.maxStock ?? existing.maxStock ?? 99,
                Math.max(existing.quantity, li.quantity)
              ),
            });
          } else {
            mergedMap.set(li.id, li);
          }
        });

        const mergedList = Array.from(mergedMap.values());
        setSelectedItemIds(mergedList.map((i) => i.id));
        return mergedList;
      });
    }

    setHasMergedRemote(true);
  }, [remoteCartProfile, hasMergedRemote]);

  // Reset merge tracker on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setHasMergedRemote(false);
    }
  }, [isAuthenticated]);

  // 3. TanStack Query: Mutation for syncing cart changes to InsForge DB
  const syncCartMutation = useMutation({
    mutationFn: async (payload: {
      items: CartItem[];
      selectedItemIds: string[];
      giftOptions: CartGiftOptions;
      appliedPromo: AppliedPromo | null;
    }) => {
      if (!user?.id) return null;
      const { data, error } = await insforge.database
        .from("profiles")
        .update({ active_cart: payload })
        .eq("id", user.id);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["user-active-cart", user?.id], {
        active_cart: variables,
      });
    },
    onError: (err) => {
      console.warn("[CartProvider/TanStack] Cart mutation error:", err);
    },
  });

  // 4. Persist cart state to localStorage and trigger debounced TanStack mutation
  useEffect(() => {
    if (!isHydrated) return;
    const payload = {
      items,
      selectedItemIds,
      giftOptions,
      appliedPromo,
    };

    // Client localStorage persistence
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("[CartProvider] Failed to persist cart to localStorage", err);
    }

    // Authenticated remote profile database sync via TanStack mutation
    if (isAuthenticated && user?.id) {
      const timer = setTimeout(() => {
        syncCartMutation.mutate(payload);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [items, selectedItemIds, giftOptions, appliedPromo, isHydrated, isAuthenticated, user?.id]);

  // Computed properties
  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedItemIds.includes(item.id));
  }, [items, selectedItemIds]);

  const selectedCount = useMemo(() => {
    return selectedItems.reduce((total, item) => total + item.quantity, 0);
  }, [selectedItems]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const selectedSubtotal = useMemo(() => {
    // If some items selected, calculate for selected items; if none selected, default to 0
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [selectedItems]);

  const rawSavings = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      if (item.compareAtPrice && item.compareAtPrice > item.price) {
        return total + (item.compareAtPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);
  }, [selectedItems]);

  const isFreeShippingEligible = useMemo(() => {
    if (selectedSubtotal >= FREE_SHIPPING_THRESHOLD) return true;
    if (appliedPromo?.discountType === "free_shipping") return true;
    return false;
  }, [selectedSubtotal, appliedPromo]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - selectedSubtotal);
  }, [selectedSubtotal]);

  const freeShippingProgress = useMemo(() => {
    if (selectedSubtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, Math.round((selectedSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [selectedSubtotal]);

  const shippingFee = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    if (isFreeShippingEligible) return 0;
    return STANDARD_SHIPPING_FEE;
  }, [selectedItems.length, isFreeShippingEligible]);

  const giftWrapFee = useMemo(() => {
    return giftOptions.isGift ? GIFT_WRAP_PRICE : 0;
  }, [giftOptions.isGift]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === "percentage") {
      return Math.round((selectedSubtotal * appliedPromo.discountValue) / 100);
    }
    if (appliedPromo.discountType === "fixed_amount") {
      return Math.min(selectedSubtotal, appliedPromo.discountValue);
    }
    return 0;
  }, [appliedPromo, selectedSubtotal]);

  const grandTotal = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    return Math.max(0, selectedSubtotal + shippingFee + giftWrapFee - discountAmount);
  }, [selectedItems.length, selectedSubtotal, shippingFee, giftWrapFee, discountAmount]);

  // Actions
  const openCartDrawer = useCallback(() => {
    setIsCartDrawerOpen(true);
    posthog.capture("cart_drawer_opened", {
      cartTotal: subtotal,
      itemCount,
    });
  }, [subtotal, itemCount]);

  const closeCartDrawer = useCallback(() => {
    setIsCartDrawerOpen(false);
  }, []);

  const toggleCartDrawer = useCallback(() => {
    setIsCartDrawerOpen((prev) => {
      const next = !prev;
      if (next) {
        posthog.capture("cart_drawer_opened", {
          cartTotal: subtotal,
          itemCount,
        });
      }
      return next;
    });
  }, [subtotal, itemCount]);

  const addItem = useCallback(
    (
      newItemData: Omit<CartItem, "id">,
      options: { openDrawer?: boolean; quantity?: number } = { openDrawer: true }
    ) => {
      const uniqueId = `${newItemData.productId}_${newItemData.variantId || "default"}`;
      const qtyToAdd = options.quantity ?? newItemData.quantity ?? 1;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((i) => i.id === uniqueId);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          const existing = updated[existingIndex];
          const maxStock = newItemData.maxStock ?? existing.maxStock ?? 99;
          const newQty = Math.min(maxStock, existing.quantity + qtyToAdd);
          updated[existingIndex] = {
            ...existing,
            quantity: newQty,
            price: newItemData.price,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            ...newItemData,
            id: uniqueId,
            quantity: qtyToAdd,
          };
          return [...prevItems, newItem];
        }
      });

      // Ensure newly added item is selected by default
      setSelectedItemIds((prev) => (prev.includes(uniqueId) ? prev : [...prev, uniqueId]));

      // PostHog analytics tracking
      posthog.capture("item_added_to_cart", {
        productId: newItemData.productId,
        variantId: newItemData.variantId,
        title: newItemData.productTitle,
        price: newItemData.price,
        quantity: qtyToAdd,
      });

      // Open drawer if requested
      if (options.openDrawer !== false) {
        setIsCartDrawerOpen(true);
      }
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.maxStock ?? 99;
          return {
            ...item,
            quantity: Math.min(maxStock, newQuantity),
          };
        }
        return item;
      })
    );
  }, []);

  const toggleSelectItem = useCallback((itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const toggleSelectAll = useCallback((select?: boolean) => {
    setSelectedItemIds((prev) => {
      if (select === undefined) {
        return prev.length === items.length ? [] : items.map((i) => i.id);
      }
      return select ? items.map((i) => i.id) : [];
    });
  }, [items]);

  const toggleGiftWrap = useCallback((enabled?: boolean) => {
    setGiftOptions((prev) => ({
      ...prev,
      isGift: enabled !== undefined ? enabled : !prev.isGift,
    }));
  }, []);

  const setGiftMessage = useCallback((message: string) => {
    setGiftOptions((prev) => ({
      ...prev,
      message,
    }));
  }, []);

  const applyPromoCode = useCallback(
    (code: string): { success: boolean; message: string } => {
      const clean = code.trim().toUpperCase();
      if (!clean) {
        return { success: false, message: "Please enter a promo code" };
      }
      const found = VALID_PROMO_CODES[clean];
      if (!found) {
        return { success: false, message: "Invalid or expired promo code" };
      }
      if (selectedSubtotal < found.minSubtotal) {
        return {
          success: false,
          message: `Minimum subtotal of ৳ ${found.minSubtotal.toLocaleString()} required for this code`,
        };
      }

      setAppliedPromo({
        code: clean,
        discountType: found.type,
        discountValue: found.value,
      });

      return { success: true, message: `Promo code ${clean} applied! (${found.description})` };
    },
    [selectedSubtotal]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedItemIds([]);
    setGiftOptions(initialGiftOptions);
    setAppliedPromo(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItems,
        selectedItemIds,
        giftOptions,
        appliedPromo,
        isCartDrawerOpen,
        isHydrated,
        itemCount,
        selectedCount,
        subtotal,
        selectedSubtotal,
        rawSavings,
        shippingFee,
        giftWrapFee,
        discountAmount,
        grandTotal,
        isFreeShippingEligible,
        freeShippingRemaining,
        freeShippingProgress,
        addItem,
        removeItem,
        updateQuantity,
        toggleSelectItem,
        toggleSelectAll,
        toggleGiftWrap,
        setGiftMessage,
        applyPromoCode,
        removePromoCode,
        clearCart,
        openCartDrawer,
        closeCartDrawer,
        toggleCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
