'use client'

import { useCart } from '@/providers/CartProvider'
import { Loader2 } from 'lucide-react'

export function CartBadge() {
  const { isLoading, totalItemsCount } = useCart()

  return (
    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : totalItemsCount}
    </span>
  )
}
