'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@/providers/CartProvider'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart()
  const productId = (() => {
    const candidate = item.product

    if (typeof candidate === 'string' || typeof candidate === 'number') {
      return candidate
    }

    if (typeof candidate === 'object' && candidate !== null && 'id' in candidate) {
      const maybeId = (candidate as { id?: string | number }).id
      return typeof maybeId === 'string' || typeof maybeId === 'number' ? maybeId : undefined
    }

    return undefined
  })()

  return (
    <form>
      <button
        aria-label="Remove cart item"
        className={clsx(
          'flex h-4.25 w-4.25 items-center justify-center rounded-full bg-neutral-500 transition-all duration-200 hover:cursor-pointer',
          {
            'cursor-not-allowed px-0': !productId || isLoading,
          },
        )}
        disabled={!productId || isLoading}
        onClick={async (e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          if (productId) await removeItem(productId)
        }}
        type="button"
      >
        <XIcon className="mx-px h-4 w-4 text-white hover:text-accent-3 dark:text-black" />
      </button>
    </form>
  )
}
