// lib/formatters.ts

export function formatPKR(amount: number | string | undefined | null): string {
  if (amount == null) return '—'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '—'
  return 'PKR ' + num.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) return `${grams / 1000}kg`
  return `${grams}g`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}

export function calcDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}