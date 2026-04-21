import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string          // `${productId}-${variantId}`
  productId: string
  variantId?: string
  name: string
  variantName?: string
  price: number       // PKR unit price
  quantity: number
  imageUrl?: string
  slug: string
  stock: number       // max available
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
  hasItem: (id: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = item.id
        set(state => {
          const existing = state.items.find(i => i.id === id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === id
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity ?? 1), i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: item.quantity ?? 1 }] }
        })
      },

      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) =>
        set(state => ({
          items:
            qty <= 0
              ? state.items.filter(i => i.id !== id)
              : state.items.map(i => (i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i)),
        })),

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      hasItem: (id) => get().items.some(i => i.id === id),
    }),
    {
      name: 'srm-cart-v1',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
)