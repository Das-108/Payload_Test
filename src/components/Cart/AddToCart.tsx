'use client'

import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
type Props = {
  product: Product
}

export function AddToCart({ product }: Props) {
  const { addItem, cart, isLoading } = useCart()

  const addToCart = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      console.log('🔥 ADD TO CART CLICKED')

      try {
        const result = await addItem({
          product: product.id,
        })

        console.log(result)

        toast.success('Item added to cart.')
      } catch (err) {
        console.error(err)
      }
    },
    [addItem, product],
  )

  const disabled = useMemo(() => {
    return (product.inventory ?? 0) <= 0
  }, [product.inventory])

  return (
    <Button
      aria-label="Add to cart"
      variant={'outline'}
      className={clsx({
        'hover:opacity-90': true,
      })}
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="submit"
    >
      Add To Cart
    </Button>
  )
}
