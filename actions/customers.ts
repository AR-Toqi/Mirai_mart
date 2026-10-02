"use server";

import { cookies } from "next/headers";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getAdminOrdersAction, type AdminOrderListItem } from "@/actions/admin";
import type {
  AdminCustomer,
  AdminCustomerDetail,
  CustomerOrderLedgerItem,
  CustomerKpiMetrics,
  AdminCustomersResponse,
  AdminCustomerDetailResponse,
} from "@/types/customers";
import type { AddressRecord, ProfileRecord } from "@/lib/db/types";

/**
 * Enforces Role-Based Access Control (RBAC) protecting sensitive customer PII and records
 */
async function verifyAdminAuthorization(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mirai_mart_token")?.value;
    const role = cookieStore.get("mirai_mart_role")?.value;

    if (process.env.NODE_ENV === "production") {
      if (!token) {
        throw new Error("Unauthorized: Active administrative session required");
      }
      if (role && role !== "admin" && role !== "store-manager") {
        throw new Error("Forbidden: Insufficient privileges to access customer directory");
      }
    }
  } catch (err) {
    if (err instanceof Error && (err.message.startsWith("Unauthorized") || err.message.startsWith("Forbidden"))) {
      throw err;
    }
  }
}

/**
 * Normalizes email address for consistent grouping
 */
function normalizeEmail(email?: string | null): string {
  return (email || "").trim().toLowerCase();
}

/**
 * Formats ISO date to readable string "May 14, 2024"
 */
function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

interface ResolvedCustomerDataset {
  customers: AdminCustomer[];
  metrics: CustomerKpiMetrics;
  ordersByEmail: Map<string, AdminOrderListItem[]>;
}

/**
 * Internal single-pass resolver combining registered profiles and orders
 */
async function resolveCustomersDataset(): Promise<ResolvedCustomerDataset> {
  const insforge = await createInsforgeServer();

  // 1. Fetch registered user profiles from InsForge PostgreSQL
  let dbProfiles: ProfileRecord[] = [];
  try {
    const { data, error } = await insforge.database
      .from("profiles")
      .select(
        "id, first_name, last_name, email, phone, avatar_url, role, addresses, created_at, updated_at"
      );

    if (!error && Array.isArray(data)) {
      dbProfiles = data as ProfileRecord[];
    }
  } catch (profileErr) {
    console.warn("[resolveCustomersDataset] Notice reading DB profiles:", profileErr);
  }

  // 2. Fetch orders in a single pass via getAdminOrdersAction
  const ordersRes = await getAdminOrdersAction();
  const ordersList: AdminOrderListItem[] = ordersRes.success ? ordersRes.orders : [];

  // Map orders by normalized customer email
  const ordersByEmail = new Map<string, AdminOrderListItem[]>();
  for (const ord of ordersList) {
    const email = normalizeEmail(ord.customer.email || ord.shippingAddress.email);
    if (!email) continue;
    const existing = ordersByEmail.get(email) || [];
    existing.push(ord);
    ordersByEmail.set(email, existing);
  }

  const customerMap = new Map<string, AdminCustomer>();

  // 3. Process registered profiles first
  for (const prof of dbProfiles) {
    const email = normalizeEmail(prof.email);
    if (!email) continue;

    const userOrders = ordersByEmail.get(email) || [];
    const fullName =
      [prof.first_name, prof.last_name].filter(Boolean).join(" ").trim() ||
      (userOrders[0]?.customer.name ?? email.split("@")[0]);

    // Calculate lifetime spend across valid non-cancelled/non-refunded orders
    const validOrders = userOrders.filter(
      (o) => o.status !== "cancelled" && o.status !== "refunded"
    );
    const lifetimeSpend = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Latest order timestamp
    const sortedOrders = [...userOrders].sort(
      (a, b) => new Date(b.rawCreatedAt).getTime() - new Date(a.rawCreatedAt).getTime()
    );
    const latestOrder = sortedOrders[0];

    // Shipping addresses: profile addresses + fallback to order shipping address
    const addresses: AddressRecord[] = Array.isArray(prof.addresses) && prof.addresses.length > 0
      ? prof.addresses
      : latestOrder
      ? [
          {
            fullName: latestOrder.shippingAddress.fullName || fullName,
            phone: latestOrder.shippingAddress.phone || prof.phone || "",
            email: latestOrder.shippingAddress.email || prof.email,
            addressLine1: latestOrder.shippingAddress.addressLine1 || "Dhaka, Bangladesh",
            city: latestOrder.shippingAddress.city || "Dhaka",
            postalCode: latestOrder.shippingAddress.postalCode || "1200",
            country: "Bangladesh",
            deliveryZone: latestOrder.shippingAddress.deliveryZone,
            isDefault: true,
          },
        ]
      : [];

    customerMap.set(email, {
      id: prof.id,
      name: fullName,
      email: prof.email,
      phone: prof.phone || latestOrder?.customer.phone || latestOrder?.shippingAddress.phone || "N/A",
      avatarUrl: prof.avatar_url,
      role: prof.role || "customer",
      accountType: "registered",
      totalOrders: userOrders.length,
      lifetimeSpend,
      lastOrderDate: latestOrder ? formatDate(latestOrder.rawCreatedAt) : null,
      rawLastOrderDate: latestOrder ? latestOrder.rawCreatedAt : null,
      registeredAt: formatDate(prof.created_at),
      rawRegisteredAt: prof.created_at || new Date().toISOString(),
      addresses,
    });
  }

  // 4. Process guest shoppers from orders not present in profiles
  for (const [email, userOrders] of ordersByEmail.entries()) {
    if (customerMap.has(email)) continue;

    const sortedOrders = [...userOrders].sort(
      (a, b) => new Date(b.rawCreatedAt).getTime() - new Date(a.rawCreatedAt).getTime()
    );
    const latestOrder = sortedOrders[0];
    const oldestOrder = sortedOrders[sortedOrders.length - 1];

    const validOrders = userOrders.filter(
      (o) => o.status !== "cancelled" && o.status !== "refunded"
    );
    const lifetimeSpend = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const customerName =
      latestOrder?.customer.name ||
      latestOrder?.shippingAddress.fullName ||
      email.split("@")[0];

    const addresses: AddressRecord[] = latestOrder
      ? [
          {
            fullName: latestOrder.shippingAddress.fullName || customerName,
            phone: latestOrder.shippingAddress.phone || latestOrder.customer.phone || "",
            email: latestOrder.shippingAddress.email || email,
            addressLine1: latestOrder.shippingAddress.addressLine1 || "Dhaka, Bangladesh",
            city: latestOrder.shippingAddress.city || "Dhaka",
            postalCode: latestOrder.shippingAddress.postalCode || "1200",
            country: "Bangladesh",
            deliveryZone: latestOrder.shippingAddress.deliveryZone,
            isDefault: true,
          },
        ]
      : [];

    customerMap.set(email, {
      id: `guest-${email}`,
      name: customerName,
      email,
      phone: latestOrder?.customer.phone || latestOrder?.shippingAddress.phone || "N/A",
      avatarUrl: null,
      role: "customer",
      accountType: "guest",
      totalOrders: userOrders.length,
      lifetimeSpend,
      lastOrderDate: latestOrder ? formatDate(latestOrder.rawCreatedAt) : null,
      rawLastOrderDate: latestOrder ? latestOrder.rawCreatedAt : null,
      registeredAt: formatDate(oldestOrder?.rawCreatedAt || new Date().toISOString()),
      rawRegisteredAt: oldestOrder?.rawCreatedAt || new Date().toISOString(),
      addresses,
    });
  }

  // 5. Convert map to list and sort (most recent activity first)
  const customers = Array.from(customerMap.values()).sort((a, b) => {
    const dateA = a.rawLastOrderDate || a.rawRegisteredAt;
    const dateB = b.rawLastOrderDate || b.rawRegisteredAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // 6. Calculate KPI Metrics
  const totalCustomers = customers.length;
  const activeBuyers = customers.filter((c) => c.totalOrders > 0).length;
  const repeatShoppers = customers.filter((c) => c.totalOrders >= 2).length;
  const totalRevenueSum = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
  const averageSpend = activeBuyers > 0 ? Math.round(totalRevenueSum / activeBuyers) : 0;
  const registeredCount = customers.filter((c) => c.accountType === "registered").length;
  const guestCount = customers.filter((c) => c.accountType === "guest").length;

  const metrics: CustomerKpiMetrics = {
    totalCustomers,
    activeBuyers,
    repeatShoppers,
    averageSpend,
    registeredCount,
    guestCount,
  };

  return {
    customers,
    metrics,
    ordersByEmail,
  };
}

/**
 * Fetches all customers consolidating registered profiles and guest orders.
 * Computes lifetime value, order frequency, and KPI summary metrics.
 */
export async function getAdminCustomersAction(): Promise<AdminCustomersResponse> {
  try {
    await verifyAdminAuthorization();
    const dataset = await resolveCustomersDataset();

    return {
      success: true,
      customers: dataset.customers,
      metrics: dataset.metrics,
    };
  } catch (error) {
    console.error("[getAdminCustomersAction] Error:", error);
    return {
      success: false,
      customers: [],
      metrics: {
        totalCustomers: 0,
        activeBuyers: 0,
        repeatShoppers: 0,
        averageSpend: 0,
        registeredCount: 0,
        guestCount: 0,
      },
      error: error instanceof Error ? error.message : "Failed to load customers",
    };
  }
}

/**
 * Fetches single customer details including itemized chronological order history ledger
 */
export async function getAdminCustomerDetailAction(
  customerIdOrEmail: string
): Promise<AdminCustomerDetailResponse> {
  try {
    await verifyAdminAuthorization();
    const dataset = await resolveCustomersDataset();

    const normalizedTarget = normalizeEmail(customerIdOrEmail);
    const customer = dataset.customers.find(
      (c) => c.id === customerIdOrEmail || normalizeEmail(c.email) === normalizedTarget
    );

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    // Retrieve order ledger for this customer directly from the single-pass map
    const customerOrders = dataset.ordersByEmail.get(normalizeEmail(customer.email)) || [];

    // Map to chronological order ledger
    const orderLedger: CustomerOrderLedgerItem[] = customerOrders
      .sort((a, b) => new Date(b.rawCreatedAt).getTime() - new Date(a.rawCreatedAt).getTime())
      .map((ord) => ({
        id: ord.id,
        orderNumber: ord.orderNumber,
        date: ord.date,
        rawDate: ord.rawCreatedAt,
        itemsCount: ord.totalItems,
        totalAmount: ord.totalAmount,
        status: ord.status,
        paymentMethod: ord.paymentMethodLabel || ord.paymentMethod,
        paymentStatus: ord.paymentStatus,
      }));

    const detail: AdminCustomerDetail = {
      ...customer,
      orders: orderLedger,
    };

    return {
      success: true,
      customer: detail,
    };
  } catch (error) {
    console.error("[getAdminCustomerDetailAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer detail",
    };
  }
}
