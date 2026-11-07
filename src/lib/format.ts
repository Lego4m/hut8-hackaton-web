const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const number = new Intl.NumberFormat('pt-BR')
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })

export const formatPrice = (cents: number) => brl.format(cents / 100)
export const formatNumber = (value: number) => number.format(value)
export const formatDate = (iso: string) => date.format(new Date(iso))
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))

/** "2026-11-07" (a calendar day, no time) → "07/11" */
export const formatDayMonth = (isoDay: string) => dayMonth.format(new Date(`${isoDay}T12:00:00`))

/** Percent change from previous to current, or null when there is no base to compare. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}
