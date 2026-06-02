// import configPromise from '@payload-config'
// import { getPayload } from 'payload'

// export async function fetchTenantByDomain(host: string, fallbackSlug?: string) {
//   const payload = await getPayload({ config: configPromise })
  
//   const domain = host.split(':')[0].toLowerCase()
//   const slugFromHost = domain.split('.')[0]
//   const slugToMatch = fallbackSlug || slugFromHost

//   console.log(`🔍 Tenant Lookup -> Host: ${host}, Domain: ${domain}, Slug: ${slugToMatch}`)

//   // 1. Try Domain Match
//   const byDomain = await payload.find({
//     collection: 'tenants',
//     where: { domain: { equals: domain } },
//   })
//   if (byDomain.docs.length > 0) return byDomain.docs[0]

//   // 2. Try Slug Match
//   const bySlug = await payload.find({
//     collection: 'tenants',
//     where: { slug: { equals: slugToMatch } },
//   })
  
//   if (bySlug.docs.length > 0) return bySlug.docs[0]

//   console.warn(`⚠️ No tenant found for ${domain} or ${slugToMatch}`)
//   return null
// }

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function fetchTenantByDomain(host: string, urlParamSlug?: string) {
  const payload = await getPayload({ config: configPromise })
  
  // Clean port mappings if executing queries on localhost local stacks
  const hostname = host.split(':')[0].toLowerCase() // e.g., "store1.localhost" or "localhost"
  const domainParts = hostname.split('.')

  let detectedSlug: string | null = null

  // Evaluate subdomain routing boundaries (e.g., store1.localhost -> parts: ['store1', 'localhost'])
  if (domainParts.length > 1 && domainParts[0] !== 'localhost' && domainParts[0] !== 'www') {
    detectedSlug = domainParts[0]
  }

  // Fallback pattern: If no subdomain exists, fall back to check if a URL path parameter exists
  const finalSlugToMatch = detectedSlug || urlParamSlug

  console.log(`🔍 Tenant Extraction Router -> Host: ${host} | Extracted Subdomain Slug: ${detectedSlug} | URL Param: ${urlParamSlug}`)

  // If we are on root platform domain (localhost:3000) and no slug matches, return null safely
  if (!finalSlugToMatch || finalSlugToMatch === 'localhost') {
    return null
  }

  // Execute safe single-query matching against database records
  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: {
      or: [
        { slug: { equals: finalSlugToMatch } },
        { domain: { equals: hostname } }
      ]
    },
    limit: 1,
  })

  if (tenantQuery.docs.length > 0) {
    return tenantQuery.docs[0]
  }

  console.warn(`⚠️ No tenant record registered within system matching identifier: ${finalSlugToMatch}`)
  return null
}