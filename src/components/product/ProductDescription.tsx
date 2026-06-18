'use client'
import type { Product } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import React, { Suspense } from 'react'

import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { StockIndicator } from '@/components/product/StockIndicator'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  const priceField = `priceIn${currency.code}` as keyof Product

  const amount = typeof product[priceField] === 'number' ? product[priceField] : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-medium">{product.title}</h1>
        <div className="uppercase font-mono">
          <Price amount={amount as number} />
        </div>
      </div>
      {product.description ? (
        <RichText className="" data={product.description} enableGutter={false} />
      ) : null}
      <hr />
      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
      </div>
    </div>
  )
}
