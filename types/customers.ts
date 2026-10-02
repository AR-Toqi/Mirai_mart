import type { UserRole } from "./auth";
import type { AddressRecord } from "@/lib/db/types";

export type CustomerAccountType = "registered" | "guest";

export interface CustomerOrderLedgerItem {
  id: string;
  orderNumber: string;
  date: string;
  rawDate: string;
  itemsCount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string | null;
  role: UserRole;
  accountType: CustomerAccountType;
  totalOrders: number;
  lifetimeSpend: number;
  lastOrderDate: string | null;
  rawLastOrderDate: string | null;
  registeredAt: string;
  rawRegisteredAt: string;
  addresses: AddressRecord[];
}

export interface AdminCustomerDetail extends AdminCustomer {
  orders: CustomerOrderLedgerItem[];
}

export interface CustomerKpiMetrics {
  totalCustomers: number;
  activeBuyers: number;
  repeatShoppers: number;
  averageSpend: number;
  registeredCount: number;
  guestCount: number;
}

export interface AdminCustomersResponse {
  success: boolean;
  customers: AdminCustomer[];
  metrics: CustomerKpiMetrics;
  error?: string;
}

export interface AdminCustomerDetailResponse {
  success: boolean;
  customer?: AdminCustomerDetail;
  error?: string;
}
