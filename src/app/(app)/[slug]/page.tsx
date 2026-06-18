import React from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CatchAllCMSPage({ params }: Props) {
  const { slug } = await params
  const host = (await headers()).get('host') || ''

  console.log('🔥 GENERIC PAGE ROUTE HIT')

  // Isolate by active store profile domain context
  const tenant = await fetchTenantByDomain(host)
  if (!tenant) return notFound()

  const payload = await getPayload({ config: configPromise })
  
  const pageRes = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { tenant: { equals: tenant.id } } // Enforces domain page isolation
      ]
    }
  })

  const page = pageRes.docs[0]
  if (!page) return notFound()

  return (
    <main>
      <h1>{page.title}</h1>
        {page.hero && <RenderHero {...page.hero} />}
      {page.layout ? <RenderBlocks blocks={page.layout} /> : null}
    </main>
  )
}