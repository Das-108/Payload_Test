import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { Page, Tenant } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // 1. Get the Tenant Slug
    let tenantSlug = ''
    if (doc.tenant) {
      // If tenant is an ID, fetch it. If it's an object, use it.
      const tenantDoc = typeof doc.tenant === 'object' 
        ? (doc.tenant as Tenant) 
        : await payload.findByID({ collection: 'tenants', id: doc.tenant, depth: 0 })
      
      tenantSlug = tenantDoc?.slug || ''
    }

    if (doc._status === 'published' && tenantSlug) {
      const path = doc.slug === 'home' ? `/${tenantSlug}` : `/${tenantSlug}/${doc.slug}`
      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path, 'layout')
    }

    // Handle revalidating old paths if slug or status changed
    if (previousDoc?._status === 'published' && tenantSlug) {
      const oldPath = previousDoc.slug === 'home' ? `/${tenantSlug}` : `/${tenantSlug}/${previousDoc.slug}`
      revalidatePath(oldPath, 'layout')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate && doc?.tenant) {
     const tenantDoc = typeof doc.tenant === 'object' 
        ? (doc.tenant as Tenant) 
        : await payload.findByID({ collection: 'tenants', id: doc.tenant, depth: 0 })
    
    const tenantSlug = tenantDoc?.slug || ''
    if (tenantSlug) {
      const path = doc?.slug === 'home' ? `/${tenantSlug}` : `/${tenantSlug}/${doc?.slug}`
      revalidatePath(path, 'layout')
    }
  }
  return doc
}