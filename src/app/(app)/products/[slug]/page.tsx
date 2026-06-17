import { GridTileImage } from '@/components/Grid/tile'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { Button } from '@/components/ui/button'
import type { Media, Product } from '@/payload-types'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const host = (await headers()).get('host') || ''
  const tenant = await fetchTenantByDomain(host)

  if (!tenant) {
    return {}
  }

  const product = await queryProductBySlug({
    slug,
    tenantId: tenant.id,
  })

  if (!product) {
    return {}
  }

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []
  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'
  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt || product.title,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const host = (await headers()).get('host') || ''
  const tenant = await fetchTenantByDomain(host)
  console.log('🔥 PRODUCT PAGE ROUTE HIT')
  if (!tenant) {
    return notFound()
  }

  console.log(tenant)

  const product = await queryProductBySlug({
    slug,
    tenantId: tenant.id,
  })

  if (!product) {
    return notFound()
  }

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const hasStock = (product.inventory ?? 0) > 0
  let price = product.priceInUSD

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: (product.meta?.image as Media)?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'USD',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="container pt-8 pb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href={`/products`}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
        <div className="flex flex-col gap-12 rounded-lg border p-8 md:py-12 lg:flex-row lg:gap-8 bg-primary-foreground">
          <div className="h-full w-full basis-full lg:basis-1/2">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-137.5 w-full overflow-hidden animate-pulse bg-neutral-200" />
              }
            >
              {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
            </Suspense>
          </div>

          <div className="basis-full lg:basis-1/2">
            <ProductDescription product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="container mt-12">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="py-8 border-t">
      <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <Link className="relative h-full w-full block" href={`/products/${product.slug}`}>
              <GridTileImage
                label={{
                  amount: product.priceInUSD!,
                  title: product.title,
                }}
                media={product.meta?.image as Media}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const queryProductBySlug = async ({
  slug,
  tenantId,
}: {
  slug: string
  tenantId: string | number
}) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  console.log(
    `🔍 [DB QUERY] Searching for product slug: "${slug}" linked to tenantId: "${tenantId}" (Draft Mode: ${draft})`,
  )

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: { equals: slug },
        },
        {
          tenant: { equals: tenantId },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  if (!result.docs || result.docs.length === 0) {
    console.log(`❌ [DB QUERY] No product matched criteria for slug: "${slug}"`)
    return null
  }

  console.log(
    `✅ [DB QUERY] Found product successfully: "${result.docs[0].title}" (ID: ${result.docs[0].id})`,
  )
  return result.docs[0]
}

export async function generateStaticParams() {
  return []
}
