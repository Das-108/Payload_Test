import { Access } from 'payload'
import { checkRole } from './utilities'

/**
 * Multi-Tenant Database Isolation Firewall
 * Automatically applies row-level scoping for standard users and tenant managers,
 * while allowing global platform administrators absolute bypass privileges.
 */
export const tenantIsolatedAccess = (): Access => {
  return ({ req: { user } }) => {
    // 1. Unauthenticated traffic cannot access tenant-protected write resources
    if (!user) return false

    // 2. Global Platform Admins ('admin') bypass isolation filters completely
    if (checkRole(['admin'], user)) return true

    // Resolve active tenant boundary mapping securely
    const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
    if (!tenantId) return false

    // 3. Store Managers ('tenant') can access records belonging strictly to their store
    if (checkRole(['tenant'], user)) {
      return {
        tenant: {
          equals: tenantId,
        },
      }
    }

    // 4. Standard Customers ('customer') can only view or manage their own records inside their store
    if (checkRole(['customer'], user)) {
      return {
        and: [
          {
            tenant: {
              equals: tenantId,
            },
          },
          {
            user: {
              equals: user.id,
            },
          },
        ],
      }
    }

    return false
  }
}