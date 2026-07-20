'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@/providers/CartProvider'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React from 'react'

export function EditItemQuantityButton({ type, item }: { item: CartItem; type: 'minus' | 'plus' }) {
  const { isLoading, updateQuantity } = useCart()
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

  const target =
    (item as { variant?: unknown }).variant &&
    typeof (item as { variant?: unknown }).variant === 'object'
      ? ((item as { variant?: { inventory?: number } }).variant as { inventory?: number })
      : item.product && typeof item.product === 'object'
        ? (item.product as { inventory?: number })
        : null

  const disabled = Boolean(
    type === 'plus' &&
    target?.inventory !== undefined &&
    target.inventory !== null &&
    item.quantity >= target.inventory,
  )

  return (
    <form>
      <button
        disabled={disabled || isLoading || !productId}
        aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
        className={clsx(
          'flex h-full min-w-9 max-w-9 flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
          {
            'cursor-not-allowed': disabled || isLoading,
            'ml-auto': type === 'minus',
          },
        )}
        onClick={async (e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()

          if (!productId) return

          const nextQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1
          await updateQuantity(productId, Math.max(0, nextQuantity))
        }}
        type="button"
      >
        {type === 'plus' ? (
          <PlusIcon className="h-4 w-4 hover:text-blue-300 dark:text-neutral-500" />
        ) : (
          <MinusIcon className="h-4 w-4 hover:text-blue-300 dark:text-neutral-500" />
        )}
      </button>
    </form>
  )
}
