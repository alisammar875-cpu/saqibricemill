'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { deleteProductAction } from '@/actions/admin/products'

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const res = await deleteProductAction(productId)
    if (res.success) {
      toast.success(`"${productName}" deleted`)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete')
    }
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={handleDelete} className="text-2xs font-semibold text-red-600 hover:text-red-800">
          Confirm
        </button>
        <button onClick={() => setConfirming(false)} className="text-2xs text-mid-gray hover:text-charcoal">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-2xs font-semibold text-red-400 hover:text-red-600">
      Delete
    </button>
  )
}
