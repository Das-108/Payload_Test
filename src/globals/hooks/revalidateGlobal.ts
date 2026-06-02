import { revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook, GlobalAfterDeleteHook } from 'payload'

// the AfterChange and AfterDelete hook types exist on the Payload side;
// they receive an object with the `slug` property for the global being
// modified.  revalidateTag will clear the unstable_cache entry created by
// `getCachedGlobal` which uses the same tag.

export const revalidateGlobal: GlobalAfterChangeHook = async ({ slug }) => {
  revalidateTag(`global_${slug}`)
  return slug
}

export const revalidateGlobalDelete: GlobalAfterDeleteHook = async ({ slug }) => {
  revalidateTag(`global_${slug}`)
  return slug
}
