import { supabase } from '@/lib/supabase'
import {
  Item,
  PurchaseOrder,
  ShippingOrder,
  Supplier,
  StockTransaction,
  DashboardStats,
} from '@/types/database'

// Helper function to check if supabase client is available
const checkSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  return supabase
}

export class SupabaseService {
  // Items Management
  static async getItems(page: number = 1, pageSize: number = 20): Promise<any> { // PaginatedResponse<Item> is removed, so using 'any' for now
    const client = checkSupabase()
    
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await client
        .from('items')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        totalItems: count || 0
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      throw error
    }
  }

  static async getItemById(id: string): Promise<Item | null> {
    const client = checkSupabase()
    
    try {
      const { data, error } = await client
        .from('items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching item:', error)
      throw error
    }
  }

  static async createItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
    const client = checkSupabase()
    
    try {
      const { data, error } = await client
        .from('items')
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating item:', error)
      throw error
    }
  }

  static async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const client = checkSupabase()
    
    try {
      const { data, error } = await client
        .from('items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  static async deleteItem(id: string): Promise<void> {
    const client = checkSupabase()
    
    try {
      const { error } = await client
        .from('items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }

  // Suppliers Management
  static async getSuppliers(): Promise<Supplier[]> {
    const client = checkSupabase()
    try {
      const { data, error } = await client
        .from('suppliers')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      throw error
    }
  }

  static async createSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    const client = checkSupabase()
    try {
      const { data, error } = await client
        .from('suppliers')
        .insert([supplier])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating supplier:', error)
      throw error
    }
  }

  // Purchase Orders Management
  static async getPurchaseOrders(page: number = 1, pageSize: number = 20): Promise<any> { // PaginatedResponse<PurchaseOrder> is removed, so using 'any' for now
    const client = checkSupabase()
    
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await client
        .from('purchase_orders')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        totalItems: count || 0
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
      throw error
    }
  }

  static async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrder> {
    const client = checkSupabase()
    try {
      const { data, error } = await client
        .from('purchase_orders')
        .insert([po])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating purchase order:', error)
      throw error
    }
  }

  static async updatePurchaseOrderStatus(poId: string, status: string): Promise<void> {
    const client = checkSupabase()
    
    try {
      const { error } = await client
        .from('purchase_orders')
        .update({ status })
        .eq('id', poId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating purchase order status:', error)
      throw error
    }
  }

  // Shipping Orders Management
  static async getShippingOrders(page: number = 1, pageSize: number = 20): Promise<any> { // PaginatedResponse<ShippingOrder> is removed, so using 'any' for now
    const client = checkSupabase()
    
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await client
        .from('shipping_orders')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        totalItems: count || 0
      }
    } catch (error) {
      console.error('Error fetching shipping orders:', error)
      throw error
    }
  }

  static async createShippingOrder(so: Omit<ShippingOrder, 'id' | 'created_at' | 'updated_at'>): Promise<ShippingOrder> {
    const client = checkSupabase()
    try {
      const { data, error } = await client
        .from('shipping_orders')
        .insert([so])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating shipping order:', error)
      throw error
    }
  }

  static async updateShippingOrderStatus(soId: string, status: string): Promise<void> {
    const client = checkSupabase()
    
    try {
      const { error } = await client
        .from('shipping_orders')
        .update({ status })
        .eq('id', soId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating shipping order status:', error)
      throw error
    }
  }

  // Stock Transactions
  static async createStockTransaction(transaction: Omit<StockTransaction, 'id' | 'created_at'>): Promise<StockTransaction> {
    const client = checkSupabase()
    try {
      const { data, error } = await client
        .from('stock_transactions')
        .insert([transaction])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating stock transaction:', error)
      throw error
    }
  }

  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    const client = checkSupabase()
    
    try {
      // Get total items
      const { count: totalItems } = await client
        .from('items')
        .select('*', { count: 'exact', head: true })

      // Get low stock items
      const { count: lowStockItems } = await client
        .from('items')
        .select('*', { count: 'exact', head: true })
        .lte('current_stock', 'min_stock_level')

      // Get total purchase orders
      const { count: totalPurchaseOrders } = await client
        .from('purchase_orders')
        .select('*', { count: 'exact', head: true })

      // Get pending approvals
      const { count: pendingApprovals } = await client
        .from('purchase_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_approval')

      // Get total shipping orders
      const { count: totalShippingOrders } = await client
        .from('shipping_orders')
        .select('*', { count: 'exact', head: true })

      // Get pending shipments
      const { count: pendingShipments } = await client
        .from('shipping_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'picking', 'picked'])

      // Get total inventory value
      const { data: items } = await client
        .from('items')
        .select('current_stock, cost_price')

      const totalValue = items?.reduce((sum, item) => sum + (item.current_stock * item.cost_price), 0) || 0

      return {
        total_items: totalItems || 0,
        low_stock_items: lowStockItems || 0,
        total_purchase_orders: totalPurchaseOrders || 0,
        pending_approvals: pendingApprovals || 0,
        total_shipping_orders: totalShippingOrders || 0,
        pending_shipments: pendingShipments || 0,
        total_value: totalValue
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Search functionality
  static async searchItems(query: string): Promise<Item[]> {
    const client = checkSupabase()
    
    try {
      const { data, error } = await client
        .from('items')
        .select('*')
        .or(`sku.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching items:', error)
      throw error
    }
  }
}
