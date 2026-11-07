/** Helpers for R$ form inputs (the API works in cents). */
export const centsToReais = (cents: number | null) => (cents === null ? '' : (cents / 100).toFixed(2))

export const reaisToCents = (value: string) =>
  value.trim() === '' ? null : Math.round(Number(value.replace(',', '.')) * 100)
