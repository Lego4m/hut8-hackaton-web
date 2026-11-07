import type { OrderStatus, PaymentMethod, UserRole } from './types'

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'canceled']

export const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  preparing: 'Em preparo',
  shipped: 'Enviado',
  delivered: 'Entregue',
  canceled: 'Cancelado',
}

/** Badge colors per status; the label text is always shown next to the color. */
export const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  paid: 'bg-sky-50 text-sky-800 ring-sky-200',
  preparing: 'bg-violet-50 text-violet-800 ring-violet-200',
  shipped: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  canceled: 'bg-stone-100 text-stone-600 ring-stone-200',
}

export const paymentLabels: Record<PaymentMethod, string> = {
  pix: 'Pix',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  cash: 'Dinheiro',
}

export const roleLabels: Record<UserRole, string> = {
  customer: 'Cliente',
  admin: 'Administrador',
}
