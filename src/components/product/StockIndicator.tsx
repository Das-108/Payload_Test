'use client'
import { Product } from '@/payload-types' // 1. Remove Variant import
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Props = {
  product: Product
}

export const StockIndicator: React.FC<Props> = ({ product }) => {
  const stockQuantity = product.inventory || 0

  return (
    <div className="uppercase font-mono text-sm font-medium text-gray-500">
      {stockQuantity < 10 && stockQuantity > 0 && <p>Only {stockQuantity} left in stock</p>}
      {(stockQuantity === 0 || !stockQuantity) && <p>Out of stock</p>}
    </div>
  )
}