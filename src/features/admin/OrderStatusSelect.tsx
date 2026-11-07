import { errorMessage } from '../../lib/api'
import { ORDER_STATUSES, statusLabels, statusStyles } from './labels'
import { useUpdateOrder } from './queries'
import type { Order, OrderStatus } from './types'

/** Changes an order's status right away (used in tables and on the order page). */
export function OrderStatusSelect({ order }: { order: Pick<Order, 'id' | 'status'> }) {
  const updateOrder = useUpdateOrder()

  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label={`Status do pedido #${order.id}`}
        value={order.status}
        disabled={updateOrder.isPending}
        onChange={(event) =>
          updateOrder.mutate({ id: order.id, changes: { status: event.target.value as OrderStatus } })
        }
        className={`cursor-pointer rounded-full border-0 py-1 pr-7 pl-2.5 text-xs font-medium ring-1 ring-inset disabled:opacity-60 ${statusStyles[order.status]}`}
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>{statusLabels[status]}</option>
        ))}
      </select>
      {updateOrder.isError && <span className="text-xs text-brand-700">{errorMessage(updateOrder.error)}</span>}
    </div>
  )
}
