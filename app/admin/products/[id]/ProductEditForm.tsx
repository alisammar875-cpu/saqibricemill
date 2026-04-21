'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateProductAction } from '@/actions/admin/products'

const RICE_TYPES = ['BASMATI_1121', 'BASMATI_SUPER', 'BROWN_BASMATI', 'SELLA_BASMATI', 'IRRI_6', 'IRRI_9']
const GRAIN_LENGTHS = ['SHORT', 'MEDIUM', 'LONG', 'EXTRA_LONG']

export function ProductEditForm({ product }: { product: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    name: product.name || '',
    nameUrdu: product.nameUrdu || '',
    description: product.description || '',
    riceType: product.riceType || 'BASMATI_1121',
    grainLength: product.grainLength || 'LONG',
    ageMonths: product.ageMonths?.toString() || '12',
    origin: product.origin || 'Punjab, Pakistan',
    organic: product.organic ?? false,
    isFeatured: product.isFeatured ?? false,
    isActive: product.isActive ?? true,
    basePrice: product.basePrice?.toString() || '',
    comparePrice: product.comparePrice?.toString() || '',
  })

  const [variants, setVariants] = useState(
    (product.variants ?? []).map((v: any) => ({
      sku: v.id || '',
      name: v.name || '',
      weight: v.weight?.toString() || '',
      priceOffset: v.priceOffset?.toString() || '0',
      stock: v.stock?.toString() || '0',
    }))
  )

  const addVariant = () => {
    setVariants([...variants, { sku: '', name: '', weight: '', priceOffset: '', stock: '' }])
  }

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_: any, i: number) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.basePrice) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      if (imageFile) {
        formData.append('image', imageFile)
      }

      formData.append('variants', JSON.stringify(variants))

      const res = await updateProductAction(product.id, formData)

      if (res?.success) {
        toast.success(`Product "${form.name}" updated successfully!`)
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error(res?.error || 'Failed to update product')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url ?? product.images?.[0]?.url

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

      {/* Image */}
      <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-charcoal">Product Image</h2>
        {primaryImage && !imageFile && (
          <div className="mb-4">
            <img src={primaryImage} alt={form.name} className="w-32 h-32 rounded-xl object-cover border border-brand" />
            <p className="text-2xs text-mid-gray mt-2">Current image</p>
          </div>
        )}
        <div>
          <label className="text-2xs font-semibold text-charcoal block mb-1.5">Replace Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors"
          />
          {imageFile && <p className="text-xs text-mid-gray mt-2">New: {imageFile.name}</p>}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-charcoal">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Product Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Name (Urdu)</label>
            <input value={form.nameUrdu} onChange={e => setForm({ ...form, nameUrdu: e.target.value })} dir="rtl"
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
        </div>
        <div>
          <label className="text-2xs font-semibold text-charcoal block mb-1.5">Description *</label>
          <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
            className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
        </div>
      </div>

      {/* Rice Details */}
      <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-charcoal">Rice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Rice Type</label>
            <select value={form.riceType} onChange={e => setForm({ ...form, riceType: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
              {RICE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Grain Length</label>
            <select value={form.grainLength} onChange={e => setForm({ ...form, grainLength: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
              {GRAIN_LENGTHS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Aged (Months)</label>
            <input type="number" value={form.ageMonths} onChange={e => setForm({ ...form, ageMonths: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Origin</label>
            <input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div className="flex items-end gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.organic} onChange={e => setForm({ ...form, organic: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald" />
              <span className="text-sm text-charcoal">Organic</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald" />
              <span className="text-sm text-charcoal">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald" />
              <span className="text-sm text-charcoal">Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-charcoal">Pricing (PKR)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Base Price (per 1kg) *</label>
            <input required type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Compare Price (strikethrough)</label>
            <input type="number" value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-charcoal">Size Variants</h2>
          <button type="button" onClick={addVariant} className="text-2xs font-semibold text-emerald hover:text-gold transition-colors">
            + Add Variant
          </button>
        </div>
        {variants.map((v: any, i: number) => (
          <div key={i} className="grid grid-cols-6 gap-3 items-end">
            <div><label className="text-2xs text-mid-gray block mb-1">SKU</label>
              <input value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="text-2xs text-mid-gray block mb-1">Name</label>
              <input value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="text-2xs text-mid-gray block mb-1">Weight (g)</label>
              <input type="number" value={v.weight} onChange={e => updateVariant(i, 'weight', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="text-2xs text-mid-gray block mb-1">Price Offset</label>
              <input type="number" value={v.priceOffset} onChange={e => updateVariant(i, 'priceOffset', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="text-2xs text-mid-gray block mb-1">Stock</label>
              <input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold" /></div>
            <div>
              <button type="button" onClick={() => removeVariant(i)} className="text-2xs text-red-400 hover:text-red-600 py-2.5">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-emerald text-xs px-10 py-3.5 disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Updating...' : 'Update Product'}
        </button>
        <Link href="/admin/products" className="btn text-xs px-6 py-3 border border-brand text-mid-gray hover:border-gold">Cancel</Link>
      </div>
    </form>
  )
}
