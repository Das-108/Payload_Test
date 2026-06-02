import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getTenantNavigation(tenantId: string | number) {
  const payload = await getPayload({ config: configPromise })

  // We find the record in the collection that matches this tenant
  const header = await payload.find({
    collection: 'header',
    where: {
      tenant: {
        equals: String(tenantId),
      },
    },
    limit: 1,
  })

  const footer = await payload.find({
    collection: 'footer',
    where: {
      tenant: {
        equals: String(tenantId),
      },
    },
    limit: 1,
  })

  return {
    headerData: header.docs[0] || null,
    footerData: footer.docs[0] || null,
  }
}