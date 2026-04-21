'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateOrderStatusAction } from '@/actions/admin/products'

const STATUSES = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export function OrderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    setSaving(true)
    const res = await updateOrderStatusAction(orderId, status)
    setSaving(false)
    if (res.success) {
      toast.success(`Status updated to "${status}"`)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to update status')
    }
  }

  return (
    <div className="flex gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-4 py-2.5 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold"
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="btn btn-emerald text-xs px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Update Status'}
      </button>
    </div>
  )
}
