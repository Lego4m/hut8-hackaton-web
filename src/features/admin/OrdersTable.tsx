import { Link } from 'react-router'
import { formatDateTime, formatPrice } from '../../lib/format'
import { paymentLabels } from './labels'
import { OrderStatusSelect } from './OrderStatusSelect'
import type { Order } from './types'

function orderContents(order: Order) {
  return order.items.map((item) => `${item.quantity}× ${item.candy_name}`).join(', ')
}

export function OrdersTable({ orders, showCustomer = true }: { orders: Order[]; showCustomer?: boolean }) {
  if (orders.length === 0) return <p className="py-6 text-center text-muted">Nenhum pedido encontrado.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-brand-100 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="py-2 pr-4 font-medium">Pedido</th>
            {showCustomer && <th className="py-2 pr-4 font-medium">Cliente</th>}
            <th className="py-2 pr-4 font-medium">Conteúdo</th>
            <th className="py-2 pr-4 font-medium">Pagamento</th>
            <th className="py-2 pr-4 text-right font-medium">Total</th>
            <th className="py-2 pr-4 text-right font-medium" title="Total − taxas − custo dos produtos">Líquido</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">
          {orders.map((order) => (
            <tr key={order.id} className="align-top hover:bg-brand-50/50">
              <td className="py-3 pr-4">
                <Link to={`/admin/pedidos/${order.id}`} className="font-semibold text-brand-600 hover:underline">
                  #{order.id}
                </Link>
                <div className="text-xs text-muted">{formatDateTime(order.created_at)}</div>
              </td>
              {showCustomer && (
                <td className="py-3 pr-4">
                  <Link to={`/admin/usuarios/${order.user.id}`} className="hover:text-brand-600 hover:underline">
                    {order.user.name}
                  </Link>
                </td>
              )}
              <td className="max-w-xs py-3 pr-4 text-muted">
                <span className="line-clamp-2" title={orderContents(order)}>{orderContents(order)}</span>
                <span className="text-xs">{order.items_count} itens</span>
              </td>
              <td className="py-3 pr-4 text-muted">{paymentLabels[order.payment_method]}</td>
              <td className="py-3 pr-4 text-right font-medium tabular-nums">{formatPrice(order.total_cents)}</td>
              <td className="py-3 pr-4 text-right tabular-nums text-muted">{formatPrice(order.net_cents)}</td>
              <td className="py-3"><OrderStatusSelect order={order} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
