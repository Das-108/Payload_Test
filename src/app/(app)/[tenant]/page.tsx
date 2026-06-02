// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { notFound } from 'next/navigation'
// import { RenderHero } from '@/heros/RenderHero'
// import { RenderBlocks } from '@/blocks/RenderBlocks'

// export default async function TenantHomePage({ params }: { params: Promise<{ tenant: string }> }) {
//   const { tenant: tenantSlug } = await params
//   const payload = await getPayload({ config: configPromise })

//   // 1. Get Tenant ID
//   const tenantRes = await payload.find({
//     collection: 'tenants',
//     where: { slug: { equals: tenantSlug } },
//   })
  
//   const tenant = tenantRes.docs[0]
//   if (!tenant) return notFound()

//   // 2. Fetch the "home" page for THIS tenant
//   const pageRes = await payload.find({
//     collection: 'pages',
//     where: {
//       and: [
//         { slug: { equals: 'home' } },
//         { tenant: { equals: tenant.id } }
//       ]
//     }
//   })

//   const page = pageRes.docs[0]

//   // 3. Fallback UI if no home page exists yet
//   if (!page) {
//     return (
//       <div className="container py-20 text-center">
//         <h1>Welcome to {tenant.name}</h1>
//         <p>Go to the admin panel and create a page with the slug "home" for this tenant.</p>
//       </div>
//     )
//   }

//   return (
//     <article>
//       <RenderHero {...page.hero} />
//       <RenderBlocks blocks={page.layout} />
//     </article>
//   )
// }

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function TenantHomePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: tenantSlug } = await params
  const headersList = await headers()
  const host = headersList.get('host') || ''
  
  const payload = await getPayload({ config: configPromise })

  // Extract tenant context safely using uniform subdomain logic
  const tenant = await fetchTenantByDomain(host, tenantSlug)
  if (!tenant) return notFound()

  // Fetch the target isolated "home" page document mapping to this merchant
  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: 'home' } },
        { tenant: { equals: tenant.id } }
      ]
    },
    limit: 1,
  })

  const page = pageRes.docs[0]

  if (!page) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Welcome to {tenant.name}</h1>
        <p className="mt-4 text-muted-foreground">
          Go to your dashboard admin panel and configure a page with the slug <code className="bg-muted px-1 py-0.5 rounded">"home"</code> for this tenant workspace.
        </p>
      </div>
    )
  }

  return (
    <article>
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}