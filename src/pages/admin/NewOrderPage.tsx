import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Card } from '../../components/Card'
import { Field } from '../../components/Field'
import { inputClass, primaryButtonClass, secondaryButtonClass } from '../../components/formStyles'
import { ORDER_STATUSES, paymentLabels, statusLabels } from '../../features/admin/labels'
import { useAdminCandies, useAdminUser, useAdminUsers, useCreateOrder, useSettings } from '../../features/admin/queries'
import type { AdminCandy, OrderStatus, PaymentMethod } from '../../features/admin/types'
import { errorMessage } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { centsToReais, reaisToCents } from '../../lib/money'

type Customer = { id: number; name: string; email: string; phone: string | null }
type Line = { candy: AdminCandy; quantity: number }

function CustomerPicker({ value, onChange }: { value: Customer | null; onChange: (customer: Customer | null) => void }) {
  const [query, setQuery] = useState('')
  const search = query.trim()
  const results = useAdminUsers({ page: 1, q: search }, { enabled: search.length >= 2 })

  if (value) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-50 p-3 text-sm">
        <div>
          <div className="font-semibold">{value.name}</div>
          <div className="text-muted">{value.email}{value.phone ? ` · ${value.phone}` : ''}</div>
        </div>
        <button type="button" onClick={() => onChange(null)} className="text-brand-600 hover:underline">Trocar cliente</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nome, e-mail ou telefone"
        aria-label="Buscar cliente"
        className={inputClass}
      />
      {search.length >= 2 && (
        <ul className="max-h-64 divide-y divide-brand-50 overflow-y-auto rounded-xl border border-brand-100">
          {results.isPending && <li className="p-3 text-sm text-muted">Buscando…</li>}
          {results.data?.data.length === 0 && (
            <li className="p-3 text-sm text-muted">
              Nenhum cliente encontrado. <Link to="/admin/usuarios/novo" className="text-brand-600 hover:underline">Cadastrar novo usuário</Link>
            </li>
          )}
          {results.data?.data.map((user) => (
            <li key={user.id}>
              <button type="button" onClick={() => onChange(user)} className="w-full p-3 text-left text-sm hover:bg-brand-50">
                <span className="font-medium">{user.name}</span>
                <span className="block text-muted">{user.email}{user.phone ? ` · ${user.phone}` : ''}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NewOrderForm({ initialCustomer }: { initialCustomer: Customer | null }) {
  const navigate = useNavigate()
  const candies = useAdminCandies()
  const settings = useSettings()
  const createOrder = useCreateOrder()

  const [customer, setCustomer] = useState<Customer | null>(initialCustomer)
  const [lines, setLines] = useState<Line[]>([])
  const [candyId, setCandyId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [status, setStatus] = useState<OrderStatus>('pending')
  const [shipping, setShipping] = useState<string | null>(null) // null = use the store's rule
  const [discount, setDiscount] = useState('')
  const [notes, setNotes] = useState('')

  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.candy.price_cents, 0)
  const freeOver = settings.data?.free_shipping_over_cents
  const autoShipping = !settings.data || (freeOver != null && subtotal >= freeOver) ? 0 : settings.data.shipping_cents
  const shippingCents = shipping === null ? autoShipping : reaisToCents(shipping) ?? 0
  const discountCents = reaisToCents(discount) ?? 0
  const total = Math.max(subtotal + shippingCents - discountCents, 0)

  const quantityInCart = (id: number) => lines.find((line) => line.candy.id === id)?.quantity ?? 0

  const addLine = () => {
    const candy = candies.data?.find((c) => c.id === Number(candyId))
    const qty = Math.floor(Number(quantity))
    if (!candy || !(qty > 0)) return

    setLines((current) =>
      current.some((line) => line.candy.id === candy.id)
        ? current.map((line) => (line.candy.id === candy.id ? { ...line, quantity: line.quantity + qty } : line))
        : [...current, { candy, quantity: qty }],
    )
    setCandyId('')
    setQuantity('1')
  }

  const setLineQuantity = (id: number, qty: number) =>
    setLines((current) => current.map((line) => (line.candy.id === id ? { ...line, quantity: Math.max(1, qty) } : line)))

  const removeLine = (id: number) => setLines((current) => current.filter((line) => line.candy.id !== id))

  const overStock = lines.filter((line) => line.quantity > line.candy.stock)
  const canSubmit = !!customer && lines.length > 0 && overStock.length === 0 && !createOrder.isPending

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (!customer || !canSubmit) return
        createOrder.mutate(
          {
            user_id: customer.id,
            status,
            payment_method: paymentMethod,
            shipping_cents: shippingCents,
            discount_cents: discountCents,
            notes: notes.trim() || null,
            items: lines.map((line) => ({ candy_id: line.candy.id, quantity: line.quantity })),
          },
          { onSuccess: (order) => navigate(`/admin/pedidos/${order.id}`) },
        )
      }}
    >
      <Card title="Cliente">
        <CustomerPicker value={customer} onChange={setCustomer} />
      </Card>

      <Card title="Itens">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Doce" className="min-w-56 flex-1">
              <select
                className={inputClass}
                value={candyId}
                onChange={(event) => setCandyId(event.target.value)}
                disabled={candies.isPending}
              >
                <option value="">{candies.isPending ? 'Carregando…' : 'Selecione um doce'}</option>
                {candies.data?.map((candy) => {
                  const left = candy.stock - quantityInCart(candy.id)
                  return (
                    <option key={candy.id} value={candy.id} disabled={left <= 0}>
                      {candy.name} — {formatPrice(candy.price_cents)} ({left > 0 ? `${left} em estoque` : 'esgotado'})
                    </option>
                  )
                })}
              </select>
            </Field>
            <Field label="Qtd." className="w-24">
              <input type="number" min="1" step="1" className={inputClass} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </Field>
            <button type="button" onClick={addLine} disabled={!candyId} className={`${secondaryButtonClass} disabled:opacity-50`}>
              Adicionar
            </button>
          </div>

          {lines.length === 0 ? (
            <p className="rounded-xl bg-brand-50 p-4 text-center text-sm text-muted">Nenhum item adicionado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-brand-100 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Doce</th>
                    <th className="py-2 pr-4 font-medium">Qtd.</th>
                    <th className="py-2 pr-4 text-right font-medium">Preço unit.</th>
                    <th className="py-2 pr-4 text-right font-medium">Total</th>
                    <th className="py-2"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {lines.map((line) => (
                    <tr key={line.candy.id}>
                      <td className="py-2 pr-4">
                        {line.candy.name}
                        {line.quantity > line.candy.stock && (
                          <span className="block text-xs text-brand-700">Só há {line.candy.stock} em estoque</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        <input
                          type="number"
                          min="1"
                          aria-label={`Quantidade de ${line.candy.name}`}
                          value={line.quantity}
                          onChange={(e) => setLineQuantity(line.candy.id, Math.floor(Number(e.target.value)) || 1)}
                          className={`${inputClass} w-20`}
                        />
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">{formatPrice(line.candy.price_cents)}</td>
                      <td className="py-2 pr-4 text-right font-medium tabular-nums">{formatPrice(line.quantity * line.candy.price_cents)}</td>
                      <td className="py-2 text-right">
                        <button type="button" onClick={() => removeLine(line.candy.id)} className="text-brand-600 hover:underline">
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Pagamento e entrega" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Forma de pagamento">
              <select className={inputClass} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
                {(Object.keys(paymentLabels) as PaymentMethod[]).map((method) => (
                  <option key={method} value={method}>{paymentLabels[method]}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </Field>
            <Field
              label="Frete (R$)"
              hint={shipping === null ? 'Calculado pelas regras da loja.' : undefined}
            >
              <div className="flex gap-2">
                <input
                  type="number" min="0" step="0.01" className={inputClass}
                  value={shipping ?? centsToReais(autoShipping)}
                  onChange={(e) => setShipping(e.target.value)}
                />
                {shipping !== null && (
                  <button type="button" onClick={() => setShipping(null)} className="whitespace-nowrap text-xs text-brand-600 hover:underline">
                    Usar padrão
                  </button>
                )}
              </div>
            </Field>
            <Field label="Desconto (R$)">
              <input type="number" min="0" step="0.01" placeholder="0,00" className={inputClass} value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </Field>
            <Field label="Observações" className="sm:col-span-2">
              <textarea rows={3} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: entregar na portaria" />
            </Field>
          </div>
        </Card>

        <Card title="Resumo">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Frete</dt><dd className="tabular-nums">{formatPrice(shippingCents)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Desconto</dt><dd className="tabular-nums">{formatPrice(-discountCents)}</dd></div>
            <div className="flex justify-between border-t border-brand-100 pt-2 text-base font-semibold">
              <dt>Total</dt><dd className="tabular-nums text-brand-600">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">Os itens serão retirados do estoque ao criar o pedido.</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          {createOrder.isPending ? 'Criando…' : 'Criar pedido'}
        </button>
        <button type="button" onClick={() => navigate('/admin/pedidos')} className={secondaryButtonClass}>Cancelar</button>
        {!customer && <span className="text-sm text-muted">Selecione um cliente.</span>}
        {customer && lines.length === 0 && <span className="text-sm text-muted">Adicione ao menos um item.</span>}
        {createOrder.isError && <span className="text-sm text-brand-700">{errorMessage(createOrder.error)}</span>}
      </div>
    </form>
  )
}

export function NewOrderPage() {
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('usuario') ?? undefined
  const presetUser = useAdminUser(userId)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/pedidos" className="text-sm text-brand-600 hover:underline">← Voltar para pedidos</Link>
      <h1 className="text-2xl font-bold">Novo pedido</h1>
      {userId && presetUser.isPending ? (
        <p className="text-muted">Carregando…</p>
      ) : (
        <NewOrderForm initialCustomer={presetUser.data ?? null} />
      )}
    </div>
  )
}
