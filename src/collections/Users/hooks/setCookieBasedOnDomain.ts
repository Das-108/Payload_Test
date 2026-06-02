import type { CollectionAfterLoginHook } from 'payload'
import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  // 1. Get the host and ensure it's lowercase for consistent matching
  const host = req.headers.get('host')?.split(':')[0].toLowerCase()

  if (!host) return user

  // 2. Find the tenant associated with this domain
  const tenantResult = await req.payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    where: {
      domain: {
        equals: host,
      },
    },
  })

  const tenant = tenantResult.docs[0]

  if (tenant) {
    // OPTIONAL: Check if the user is assigned to this tenant 
    // This prevents a user from one store from accidentally 
    // getting a session cookie for another store's subdomain.
    const userHasAccess = user.tenants?.some(
      (t: any) => (typeof t.tenant === 'object' ? t.tenant.id : t.tenant) === tenant.id
    ) || user.roles?.includes('admin')

    if (!userHasAccess) return user

    const secure = process.env.NODE_ENV === 'production'
    
    // 3. Generate the tenant cookie
    const tenantCookie = generateCookie({
      name: 'payload-tenant',
      // Ensure the cookie lasts as long as the auth session
      expires: getCookieExpiration({ seconds: 7200 }), 
      path: '/',
      secure,
      httpOnly: true, // Recommended for security
      sameSite: 'Lax',
      returnCookieAsObject: false,
      value: String(tenant.id),
    })

    const newHeaders = new Headers()
    newHeaders.append('Set-Cookie', tenantCookie as string)

    // 4. Merge with existing response headers
    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders
  }

  return user
}