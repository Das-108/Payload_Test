import { revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

// Revalidate entries created by `getCachedGlobal` using a tag cache validation pipeline
export const revalidateGlobal: GlobalAfterChangeHook = async ({ global }) => {
  if (global?.slug) {
    revalidateTag(`global_${global.slug}`)
  }
  return global
}