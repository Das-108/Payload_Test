'use client'

import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'

import { useCart } from '@/providers/CartProvider'
import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'

type Props = {
  product: Product
}

export function AddToCart({ product }: Props) {
  const { addItem, isLoading } = useCart()

  const addToCart = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!product.id) return
      await addItem({ product: product.id })
    },
    [addItem, product.id],
  )

  const disabled = useMemo(() => {
    return (product.inventory ?? 0) <= 0 || isLoading
  }, [isLoading, product.inventory])

  return (
    <Button
      aria-label="Add to cart"
      variant={'outline'}
      className={clsx({
        'hover:opacity-90': true,
      })}
      disabled={disabled}
      onClick={addToCart}
      type="submit"
    >
      {isLoading ? 'Adding…' : 'Add To Cart'}
    </Button>
  )
}
