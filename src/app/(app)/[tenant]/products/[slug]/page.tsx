import type { Media, Product, Tenant } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/Grid/tile'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    tenant: string
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, tenant } = await params
  const product = await queryProductBySlug({ slug, tenant })

  if (!product) return {}

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
  const { slug, tenant: tenantSlug } = await params
  const product = await queryProductBySlug({ slug, tenant: tenantSlug })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return (variant.inventory ?? 0) > 0
      })
    : (product.inventory ?? 0) > 0

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
          <Link href={`/${tenantSlug}/products`}>
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

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : null}

      {relatedProducts.length > 0 && (
        <div className="container mt-12">
          <RelatedProducts products={relatedProducts as Product[]} tenantSlug={tenantSlug} />
        </div>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products, tenantSlug }: { products: Product[]; tenantSlug: string }) {
  return (
    <div className="py-8 border-t">
      <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            {/* Added tenantSlug to the link path */}
            <Link className="relative h-full w-full block" href={`/${tenantSlug}/products/${product.slug}`}>
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

const queryProductBySlug = async ({ slug, tenant }: { slug: string; tenant: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

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
          'tenant.slug': { equals: tenant },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    pagination: false,
    // Ensure we get the tenant slug for the path
    depth: 1, 
  })

  return products.docs.map((product) => {
    // Handling both populated and ID-only tenant scenarios
    const tenantSlug = typeof product.tenant === 'object' 
        ? (product.tenant as Tenant).slug 
        : null

    return {
      tenant: tenantSlug,
      slug: product.slug,
    }
  }).filter(item => item.tenant && item.slug) // Only generate valid combos
} 