// src/utilities/getTenantData.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getTenantNavigation(tenantId: string) {
  const payload = await getPayload({ config: configPromise })

  const header = await payload.find({
    collection: 'header',
    where: { tenant: { equals: tenantId } },
  })

  const footer = await payload.find({
    collection: 'footer',
    where: { tenant: { equals: tenantId } },
  })

  return {
    headerData: header.docs[0] || null,
    footerData: footer.docs[0] || null,
  }
}