import { Access, Where } from 'payload'
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

    // Resolve active tenant boundary mapping securely by checking the multi-tenant layout 'tenants' array
    // Adapts to both array of IDs or an array of populated tenant objects
    let tenantId: string | number | null = null

    if (user.tenants && Array.isArray(user.tenants) && user.tenants.length > 0) {
      const primaryTenantObj = user.tenants[0]

      if (primaryTenantObj && typeof primaryTenantObj === 'object') {
        const tenantReference = 'tenant' in primaryTenantObj ? primaryTenantObj.tenant : null
        tenantId = typeof tenantReference === 'object' ? tenantReference?.id ?? null : tenantReference
      } else {
        tenantId = primaryTenantObj
      }
    }

    if (!tenantId) return false

    // 3. Store Managers ('tenant') can access records belonging strictly to their store
    if (checkRole(['tenant'], user)) {
      const managerFilter: Where = {
        tenant: {
          equals: tenantId,
        },
      }
      return managerFilter
    }

    // 4. Standard Customers ('customer') can only view or manage their own records inside their store
    if (checkRole(['customer'], user)) {
      const customerFilter: Where = {
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
      return customerFilter
    }

    return false
  }
}
