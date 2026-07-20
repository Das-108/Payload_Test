'use client'

import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@/providers/CartProvider'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Media, Product } from '@/payload-types'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

export function CartModal() {
  const { cart, clearCart, isLoading } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  const isEmpty = !cart || !cart.items?.length

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
          <SheetDescription>Manage your cart here, add items to view the total.</SheetDescription>
        </SheetHeader>

        {isLoading && !cart ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <ShoppingCart className="h-16" />
            <p className="text-center text-xl font-semibold">Loading your cart…</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <ShoppingCart className="h-16" />
            <p className="text-center text-2xl font-bold">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex grow px-4">
            <div className="flex w-full flex-col justify-between">
              <ul className="grow overflow-auto py-4">
                {cart?.items?.map((item, i) => {
                  const product = item.product
                  const variant = (item as { variant?: unknown }).variant

                  if (typeof product !== 'object' || !item || !product || !('slug' in product)) {
                    return <React.Fragment key={i} />
                  }

                  const typedProduct = product as Product & {
                    slug?: string
                    meta?: { image?: Media | null }
                    gallery?: Array<{
                      image?: Media | null
                      variantOption?: unknown
                    }>
                    priceInUSD?: number
                    title?: string
                  }

                  const metaImage = typedProduct.meta?.image ?? undefined

                  const firstGalleryImage =
                    typedProduct.gallery?.[0]?.image &&
                    typeof typedProduct.gallery[0].image === 'object'
                      ? typedProduct.gallery[0].image
                      : undefined

                  let image = firstGalleryImage || metaImage
                  let price: number | undefined = typedProduct.priceInUSD

                  const isVariant = Boolean(variant) && typeof variant === 'object'

                  if (isVariant) {
                    const variantData = variant as { priceInUSD?: number; options?: Array<unknown> }
                    price = variantData.priceInUSD

                    const imageVariant = typedProduct.gallery?.find((galleryItem) => {
                      if (!('variantOption' in galleryItem) || !galleryItem.variantOption)
                        return false
                      const variantOptionID =
                        typeof galleryItem.variantOption === 'object' &&
                        galleryItem.variantOption !== null
                          ? (galleryItem.variantOption as { id?: string | number }).id
                          : galleryItem.variantOption

                      const hasMatch = variantData.options?.some((option) => {
                        if (typeof option === 'object' && option !== null) {
                          return (option as { id?: string | number }).id === variantOptionID
                        }
                        return option === variantOptionID
                      })

                      return hasMatch
                    })

                    if (
                      imageVariant &&
                      imageVariant.image &&
                      typeof imageVariant.image === 'object'
                    ) {
                      image = imageVariant.image
                    }
                  }

                  return (
                    <li className="flex w-full flex-col" key={i}>
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <div className="absolute z-40 -mt-2 ml-13.75">
                          <DeleteItemButton item={item} />
                        </div>
                        <Link
                          className="z-30 flex flex-row space-x-4"
                          href={`/products/${typedProduct.slug}`}
                        >
                          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            {image?.url && (
                              <Image
                                alt={image.alt || typedProduct.title || ''}
                                className="h-full w-full object-cover"
                                height={94}
                                src={image.url}
                                width={94}
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col text-base">
                            <span className="leading-tight">{typedProduct.title}</span>
                            {isVariant && variant ? (
                              <p className="text-sm capitalize text-neutral-500 dark:text-neutral-400">
                                {(variant as { options?: Array<{ label?: string }> }).options
                                  ?.map((option) => option.label)
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                        <div className="flex h-16 flex-col justify-between">
                          {typeof price === 'number' && (
                            <Price
                              amount={price}
                              className="flex justify-end space-y-2 text-right text-sm"
                            />
                          )}
                          <div className="ml-auto flex h-9 flex-row items-center rounded-lg border">
                            <EditItemQuantityButton item={item} type="minus" />
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">{item.quantity}</span>
                            </p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="px-4">
                <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {typeof cart?.subtotal === 'number' && (
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        amount={cart.subtotal}
                        className="text-right text-base text-black dark:text-white"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        void clearCart()
                      }}
                      type="button"
                      variant="outline"
                    >
                      Clear cart
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
