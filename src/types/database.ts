// Database Types for MDM Inventory Management System

export interface Organization {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  phone: string
  email: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  organization_id: string
  organization_name: string
  phone?: string
  department?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'buyer' | 'approver' | 'warehouse' | 'manager' | 'auditor'

export interface Supplier {
  id: string
  organization_id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  payment_terms: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  organization_id: string
  sku: string
  name: string
  description?: string
  category: string
  unit_of_measure: string
  cost_price: number
  selling_price: number
  min_stock_level: number
  max_stock_level: number
  current_stock: number
  bin_location?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  id: string
  organization_id: string
  po_number: string
  supplier_id: string
  supplier_name: string
  buyer_id: string
  buyer_name: string
  status: PurchaseOrderStatus
  order_date: string
  expected_delivery_date: string
  total_amount: number
  notes?: string
  created_at: string
  updated_at: string
}

export type PurchaseOrderStatus = 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'received' | 'cancelled'

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  item_id: string
  item_sku: string
  item_name: string
  quantity: number
  unit_price: number
  total_price: number
  received_quantity: number
  created_at: string
}

export interface ShippingOrder {
  id: string
  organization_id: string
  so_number: string
  customer_name: string
  customer_address: string
  customer_city: string
  customer_state: string
  customer_zip: string
  customer_country: string
  status: ShippingOrderStatus
  order_date: string
  ship_date?: string
  tracking_number?: string
  total_amount: number
  notes?: string
  created_at: string
  updated_at: string
}

export type ShippingOrderStatus = 'draft' | 'picking' | 'picked' | 'shipped' | 'delivered' | 'cancelled'

export interface ShippingOrderItem {
  id: string
  shipping_order_id: string
  item_id: string
  item_sku: string
  item_name: string
  quantity: number
  unit_price: number
  total_price: number
  picked_quantity: number
  created_at: string
}

export interface StockTransaction {
  id: string
  organization_id: string
  item_id: string
  item_sku: string
  item_name: string
  transaction_type: StockTransactionType
  quantity: number
  reference_type: string
  reference_id: string
  notes?: string
  created_at: string
}

export type StockTransactionType = 'receipt' | 'issue' | 'adjustment' | 'transfer'

export interface DashboardStats {
  total_items: number
  low_stock_items: number
  total_purchase_orders: number
  pending_approvals: number
  total_shipping_orders: number
  pending_shipments: number
  total_value: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
