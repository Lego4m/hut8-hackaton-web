import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Card } from '../../components/Card'
import { paymentLabels } from '../../features/admin/labels'
import { OrderStatusSelect } from '../../features/admin/OrderStatusSelect'
import { useAdminOrder, useUpdateOrder } from '../../features/admin/queries'
import { errorMessage } from '../../lib/api'
import { formatDateTime, formatPrice } from '../../lib/format'

function NotesForm({ orderId, notes }: { orderId: number; notes: string }) {
  const [value, setValue] = useState(notes)
  const updateOrder = useUpdateOrder()

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        updateOrder.mutate({ id: orderId, changes: { notes: value } })
      }}
    >
      <textarea
        aria-label="Observações"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
        placeholder="Ex.: entregar na portaria"
        className="rounded-xl border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={updateOrder.isPending}
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {updateOrder.isPending ? 'Salvando…' : 'Salvar observações'}
        </button>
        {updateOrder.isSuccess && <span className="text-sm text-emerald-700">Salvo!</span>}
        {updateOrder.isError && <span className="text-sm text-brand-700">{errorMessage(updateOrder.error)}</span>}
      </div>
    </form>
  )
}

export function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, isPending, isError } = useAdminOrder(id)

  if (isPending) return <p className="text-muted">Carregando…</p>
  if (isError) return <p className="text-brand-700">Pedido não encontrado.</p>

  const totals = [
    ['Subtotal', order.subtotal_cents],
    ['Frete', order.shipping_cents],
    ['Desconto', -order.discount_cents],
  ] as const
  const breakdown = [
    ['Taxa de pagamento', -order.fee_cents],
    ['Custo dos produtos', -order.cost_cents],
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/pedidos" className="text-sm text-brand-600 hover:underline">← Voltar para pedidos</Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
          <p className="text-sm text-muted">
            Feito em {formatDateTime(order.created_at)} · {paymentLabels[order.payment_method]}
          </p>
        </div>
        <OrderStatusSelect order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Itens" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-brand-100 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="py-2 pr-4 font-medium">Doce</th>
                  <th className="py-2 pr-4 text-right font-medium">Qtd.</th>
                  <th className="py-2 pr-4 text-right font-medium">Preço unit.</th>
                  <th className="py-2 pr-4 text-right font-medium">Custo unit.</th>
                  <th className="py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 pr-4">
                      <Link to={`/doces/${item.candy_id}`} className="hover:text-brand-600 hover:underline">{item.candy_name}</Link>
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums">{item.quantity}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{formatPrice(item.unit_price_cents)}</td>
                    <td className="py-2 pr-4 text-right tabular-nums text-muted">{formatPrice(item.unit_cost_cents)}</td>
                    <td className="py-2 text-right font-medium tabular-nums">{formatPrice(item.total_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Valores">
            <dl className="flex flex-col gap-2 text-sm">
              {totals.map(([label, cents]) => (
                <div key={label} className="flex justify-between"><dt className="text-muted">{label}</dt><dd className="tabular-nums">{formatPrice(cents)}</dd></div>
              ))}
              <div className="flex justify-between border-t border-brand-100 pt-2 font-semibold"><dt>Total pago</dt><dd className="tabular-nums">{formatPrice(order.total_cents)}</dd></div>
              {breakdown.map(([label, cents]) => (
                <div key={label} className="flex justify-between"><dt className="text-muted">{label}</dt><dd className="tabular-nums text-muted">{formatPrice(cents)}</dd></div>
              ))}
              <div className="flex justify-between border-t border-brand-100 pt-2 font-semibold text-brand-600"><dt>Valor líquido</dt><dd className="tabular-nums">{formatPrice(order.net_cents)}</dd></div>
            </dl>
          </Card>

          <Card title="Cliente">
            <div className="flex flex-col gap-1 text-sm">
              <Link to={`/admin/usuarios/${order.user.id}`} className="font-semibold text-brand-600 hover:underline">{order.user.name}</Link>
              <span className="text-muted">{order.user.email}</span>
              {order.user.phone && <span className="text-muted">{order.user.phone}</span>}
            </div>
          </Card>
        </div>
      </div>

      <Card title="Observações">
        <NotesForm key={order.id} orderId={order.id} notes={order.notes ?? ''} />
      </Card>
    </div>
  )
}
