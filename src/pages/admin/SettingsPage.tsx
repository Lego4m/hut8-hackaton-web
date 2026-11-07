import { useState } from 'react'
import { Card } from '../../components/Card'
import { Field } from '../../components/Field'
import { inputClass, primaryButtonClass } from '../../components/formStyles'
import { useSettings, useUpdateSettings } from '../../features/admin/queries'
import type { StoreSettings } from '../../features/admin/types'
import { errorMessage } from '../../lib/api'
import { formatDateTime } from '../../lib/format'
import { centsToReais, reaisToCents } from '../../lib/money'

function SettingsForm({ settings }: { settings: StoreSettings }) {
  const updateSettings = useUpdateSettings()
  const [form, setForm] = useState({
    store_name: settings.store_name,
    contact_email: settings.contact_email ?? '',
    contact_phone: settings.contact_phone ?? '',
    whatsapp: settings.whatsapp ?? '',
    address: settings.address ?? '',
    shipping: centsToReais(settings.shipping_cents),
    free_shipping_over: centsToReais(settings.free_shipping_over_cents),
    payment_fee_percent: String(settings.payment_fee_percent),
    accepting_orders: settings.accepting_orders,
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        updateSettings.mutate({
          store_name: form.store_name,
          contact_email: form.contact_email || null,
          contact_phone: form.contact_phone || null,
          whatsapp: form.whatsapp || null,
          address: form.address || null,
          shipping_cents: reaisToCents(form.shipping) ?? 0,
          free_shipping_over_cents: reaisToCents(form.free_shipping_over),
          payment_fee_percent: Number(form.payment_fee_percent.replace(',', '.')),
          accepting_orders: form.accepting_orders,
        })
      }}
    >
      <Card title="Loja">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da loja">
            <input required className={inputClass} value={form.store_name} onChange={(e) => set('store_name', e.target.value)} />
          </Field>
          <Field label="Endereço">
            <input className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-500"
              checked={form.accepting_orders}
              onChange={(e) => set('accepting_orders', e.target.checked)}
            />
            <span>
              <span className="font-medium">Aceitando pedidos</span>
              <span className="block text-xs text-muted">Desmarque para pausar novas compras na loja.</span>
            </span>
          </label>
        </div>
      </Card>

      <Card title="Contato">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="E-mail">
            <input type="email" className={inputClass} value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} />
          </Field>
          <Field label="Telefone">
            <input className={inputClass} value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className={inputClass} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Frete e pagamento">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Frete padrão (R$)">
            <input type="number" min="0" step="0.01" className={inputClass} value={form.shipping} onChange={(e) => set('shipping', e.target.value)} />
          </Field>
          <Field label="Frete grátis acima de (R$)" hint="Deixe vazio para não oferecer frete grátis.">
            <input type="number" min="0" step="0.01" className={inputClass} value={form.free_shipping_over} onChange={(e) => set('free_shipping_over', e.target.value)} />
          </Field>
          <Field label="Taxa de pagamento (%)" hint="Usada para calcular o valor líquido dos novos pedidos.">
            <input type="number" min="0" max="99.99" step="0.01" className={inputClass} value={form.payment_fee_percent} onChange={(e) => set('payment_fee_percent', e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={updateSettings.isPending} className={primaryButtonClass}>
          {updateSettings.isPending ? 'Salvando…' : 'Salvar configurações'}
        </button>
        {updateSettings.isSuccess && <span className="text-sm text-emerald-700">Configurações salvas!</span>}
        {updateSettings.isError && <span className="text-sm text-brand-700">{errorMessage(updateSettings.error)}</span>}
      </div>
    </form>
  )
}

export function SettingsPage() {
  const { data, isPending, isError } = useSettings()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        {data && <p className="text-sm text-muted">Última alteração em {formatDateTime(data.updated_at)}</p>}
      </div>
      {isPending && <p className="text-muted">Carregando…</p>}
      {isError && <p className="text-brand-700">Não foi possível carregar as configurações.</p>}
      {data && <SettingsForm settings={data} />}
    </div>
  )
}
