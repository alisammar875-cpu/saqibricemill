import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeDoc(data: any): any {
  if (data === null || data === undefined) return data
  
  if (data instanceof Date) return data.toISOString()
  
  // Handle Firebase Timestamps (both Admin and Client SDK versions)
  if (typeof data === 'object') {
    if (data._seconds !== undefined && data._nanoseconds !== undefined) {
      return new Date(data._seconds * 1000).toISOString()
    }
    if (data.constructor?.name === 'Timestamp' || typeof data.toDate === 'function') {
      return data.toDate().toISOString()
    }
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeDoc(item))
  }

  if (typeof data === 'object') {
    const serialized: any = {}
    for (const key in data) {
      serialized[key] = serializeDoc(data[key])
    }
    return serialized
  }

  return data
}
