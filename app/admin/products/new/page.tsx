'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createProductAction } from '@/actions/admin/products'

const RICE_TYPES = ['BASMATI_1121', 'BASMATI_SUPER', 'BROWN_BASMATI', 'SELLA_BASMATI', 'IRRI_6', 'IRRI_9']
const GRAIN_LENGTHS = ['SHORT', 'MEDIUM', 'LONG', 'EXTRA_LONG']

export default function AdminNewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [product, setProduct] = useState({
    name: '', nameUrdu: '', description: '', categoryId: '', riceType: 'BASMATI_1121',
    grainLength: 'LONG', basePrice: '', comparePrice: '', ageMonths: '12',
    origin: 'Punjab, Pakistan', organic: false, isFeatured: false,
  })
  const [variants, setVariants] = useState([
    { sku: '', name: '1kg Bag', weight: '1000', priceOffset: '0', stock: '100' },
  ])

  const addVariant = () => {
    setVariants([...variants, { sku: '', name: '', weight: '', priceOffset: '', stock: '' }])
  }

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product.name || !product.basePrice) {
      toast.error('Please fill all required fields')
      return
    }

    if (!imageFile) {
      toast.error('Please select a product image')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      
      // Append basic fields
      const autoSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      formData.append('slug', autoSlug)

      Object.entries(product).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      
      // Append image
      formData.append('image', imageFile)
      
      // Append variants as JSON string
      formData.append('variants', JSON.stringify(variants))

      const res = await createProductAction(formData)
      
      if (res?.success) {
        toast.success(`Product "${product.name}" created successfully!`)
        router.push('/admin/products')
      } else {
        toast.error(res?.error || 'Failed to create product')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
        <Link href="/admin/products" className="hover:text-gold transition-colors">Products</Link>
        <span>/</span>
        <span className="text-charcoal font-semibold">New Product</span>
      </div>

      <h1 className="font-display text-2xl font-semibold text-charcoal mb-8">Add New Rice Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        
        {/* Image Upload */}
        <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal">Product Image</h2>
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Primary Image (Required)</label>
            <input 
              type="file" 
              required
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" 
            />
            {imageFile && (
              <p className="text-xs text-mid-gray mt-2">Selected: {imageFile.name}</p>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Product Name *</label>
              <input required value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })}
                placeholder="e.g. 1121 Super Basmati Extra Long Grain"
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Name (Urdu)</label>
              <input value={product.nameUrdu} onChange={e => setProduct({ ...product, nameUrdu: e.target.value })}
                placeholder="اردو نام" dir="rtl"
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-2xs font-semibold text-charcoal block mb-1.5">Description *</label>
            <textarea required value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} rows={4}
              placeholder="Describe the rice variety, quality, and ideal uses..."
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
          </div>
        </div>

        {/* Rice Details */}
        <div className="bg-ivory rounded-xl border border-brand p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal">Rice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Rice Type</label>
              <select value={product.riceType} onChange={e => setProduct({ ...product, riceType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
                {RICE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Grain Length</label>
              <select value={product.grainLength} onChange={e => setProduct({ ...product, grainLength: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
                {GRAIN_LENGTHS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Aged (Months)</label>
              <input type="number" value={product.ageMonths} onChange={e => setProduct({ ...product, ageMonths: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Origin</label>
              <input value={product.origin} onChange={e => setProduct({ ...product, origin: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div className="flex items-end gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={product.organic} onChange={e => setProduct({ ...product, organic: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald" />
                <span className="text-sm text-charcoal">Organic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={product.isFeatured} onChange={e => setProduct({ ...product, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald" />
                <span className="text-sm text-charcoal">Featured</span>
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
              <input required type="number" value={product.basePrice} onChange={e => setProduct({ ...product, basePrice: e.target.value })}
                placeholder="850"
                className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="text-2xs font-semibold text-charcoal block mb-1.5">Compare Price (strikethrough)</label>
              <input type="number" value={product.comparePrice} onChange={e => setProduct({ ...product, comparePrice: e.target.value })}
                placeholder="950"
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
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 gap-3 items-end">
              <div><label className="text-2xs text-mid-gray block mb-1">SKU</label>
                <input value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} placeholder="SRM-1121-1KG"
                  className="w-full px-3 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold" /></div>
              <div><label className="text-2xs text-mid-gray block mb-1">Name</label>
                <input value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} placeholder="1kg Bag"
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
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-emerald text-xs px-10 py-3.5 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? 'Creating Product...' : 'Create Product'}
          </button>
          <Link href="/admin/products" className="btn text-xs px-6 py-3 border border-brand text-mid-gray hover:border-gold">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
