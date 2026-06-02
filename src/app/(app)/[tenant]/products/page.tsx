import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GridTileImage } from '@/components/Grid/tile'
import Link from 'next/link'
import React from 'react'

export default async function ProductsIndex({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    limit: 1000,
    overrideAccess: true,
    where: {
      'tenant.slug': { equals: tenant },
    },
    pagination: false,
    select: { title: true, slug: true, gallery: true, priceInUSD: true },
  })

  const products = result.docs

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">All products</h1>
      {products.length === 0 && (
        <p className="text-gray-500">No products yet. Add some in the admin panel.</p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="aspect-square">
            <Link href={`/products/${product.slug}`} className="block h-full w-full">
              <GridTileImage
                label={{ title: product.title, amount: (product.priceInUSD ?? 0) }}
                media={(product.gallery?.[0]?.image as any) ?? null}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}