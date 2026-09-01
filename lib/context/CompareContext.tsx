"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import posthog from "posthog-js";
import type { Product } from "@/types";
import { MAX_COMPARE_ITEMS } from "@/lib/constants";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isDockVisible: boolean;
  setIsDockVisible: (visible: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = "mirai_mart_compare_items";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed.slice(0, MAX_COMPARE_ITEMS));
        }
      }
    } catch (e) {
      console.warn("[CompareContext] Failed to load compare items:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
    } catch (e) {
      console.warn("[CompareContext] Failed to save compare items:", e);
    }
  }, [compareItems, isHydrated]);

  const isInCompare = useCallback(
    (productId: string) => {
      return compareItems.some((item) => item.id === productId);
    },
    [compareItems]
  );

  const addToCompare = useCallback(
    (product: Product): boolean => {
      if (compareItems.some((item) => item.id === product.id)) {
        return false;
      }
      if (compareItems.length >= MAX_COMPARE_ITEMS) {
        return false;
      }

      const updated = [...compareItems, product];
      setCompareItems(updated);
      setIsDockVisible(true);

      // Track PostHog event
      try {
        posthog.capture("product_compared", {
          productId: product.id,
          productTitle: product.title,
          category: product.category,
          totalCompared: updated.length,
          productIds: updated.map((i) => i.id),
        });
      } catch (err) {
        console.warn("[PostHog] Error tracking product_compared:", err);
      }

      return true;
    },
    [compareItems]
  );

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleCompare = useCallback(
    (product: Product) => {
      if (isInCompare(product.id)) {
        removeFromCompare(product.id);
      } else {
        addToCompare(product);
      }
    },
    [isInCompare, removeFromCompare, addToCompare]
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        isDockVisible,
        setIsDockVisible,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
