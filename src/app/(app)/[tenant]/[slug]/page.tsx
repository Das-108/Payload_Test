import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function Page({ params }: { params: Promise<{ tenant: string; slug: string }> }) {
  const { tenant: tenantSlug, slug } = await params // Now we get BOTH
  const payload = await getPayload({ config: configPromise })

  // 1. Find Tenant by Slug
  const tenantRes = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: tenantSlug } },
  })
  
  const tenantId = tenantRes.docs[0]?.id
  if (!tenantId) return notFound()

  // 2. Find Page by Slug AND Tenant ID
  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slug } },
        { tenant: { equals: tenantId } }
      ]
    }
  })

  console.log('--- DEBUG ---');
  console.log('URL Tenant Slug:', tenantSlug);
  console.log('Found Tenant ID:', tenantId);
  console.log('Searching for Page Slug:', slug);

  const page = pageRes.docs[0]
  if (!page) return notFound()

  return (
    <article>
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout ?? []} />
    </article>
  )
}