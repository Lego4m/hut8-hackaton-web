export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'canceled'
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash'
export type UserRole = 'customer' | 'admin'

export type AdminUser = {
  id: number
  name: string
  email: string
  phone: string | null
  role: UserRole
  city: string | null
  state: string | null
  address?: string | null
  has_password?: boolean
  created_at: string
  orders_count: number
  spent_cents: number
  last_order_at: string | null
}

export type OrderItem = {
  id: number
  candy_id: number
  candy_name: string
  quantity: number
  unit_price_cents: number
  unit_cost_cents: number
  total_cents: number
}

export type Order = {
  id: number
  status: OrderStatus
  payment_method: PaymentMethod
  subtotal_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  fee_cents: number
  cost_cents: number
  net_cents: number
  items_count: number
  created_at: string
  updated_at: string
  notes?: string | null
  user: { id: number; name: string; email: string; phone: string | null }
  items: OrderItem[]
}

export type PeriodMetrics = {
  orders_count: number
  earned_cents: number
  spent_cents: number
  net_cents: number
  average_ticket_cents: number
  canceled_count: number
  new_customers_count: number
}

export type DailyPoint = {
  date: string
  orders_count: number
  earned_cents: number
  net_cents: number
}

export type Overview = {
  days: number
  current: PeriodMetrics
  previous: PeriodMetrics
  daily: DailyPoint[]
  orders_by_status: Partial<Record<OrderStatus, number>>
  top_candies: { id: number; name: string; quantity: number; earned_cents: number }[]
  recent_orders: Order[]
}

export type StoreSettings = {
  store_name: string
  contact_email: string | null
  contact_phone: string | null
  whatsapp: string | null
  address: string | null
  shipping_cents: number
  free_shipping_over_cents: number | null
  payment_fee_percent: number
  accepting_orders: boolean
  updated_at: string
}

export type AdminCandy = {
  id: number
  name: string
  category: string | null
  price_cents: number
  cost_cents: number
  stock: number
}

export type UserInput = {
  name: string
  email: string
  phone: string | null
  role: UserRole
  address: string | null
  city: string | null
  state: string | null
  /** Only sent when set; empty keeps the current password. */
  password?: string
}

export type NewOrderInput = {
  user_id: number
  status: OrderStatus
  payment_method: PaymentMethod
  shipping_cents: number
  discount_cents: number
  notes: string | null
  items: { candy_id: number; quantity: number }[]
}
