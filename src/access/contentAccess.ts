import { Access, Where } from 'payload'
import { checkRole } from './utilities'

/**
 * Read Access: Anyone can read published pages/products, but draft content is restricted
 * to the assigned store admin or global platform admins.
 */
export const publicTenantReadAccess = (): Access => {
  return ({ req: { user } }) => {
    // 1. Global Platform Admins see all store configurations (including drafts)
    if (user && checkRole(['admin'], user)) return true

    // 2. Resolve active tenant context for logged-in users
    const assignedTenants = (user as any)?.tenants
    let tenantId: string | null = null

    if (assignedTenants) {
      if (Array.isArray(assignedTenants) && assignedTenants.length > 0) {
        tenantId = typeof assignedTenants[0] === 'object' ? assignedTenants[0]?.id : assignedTenants[0]
      } else {
        tenantId = typeof assignedTenants === 'object' ? assignedTenants?.id : assignedTenants
      }
    }

    // 3. If a logged-in store owner ('tenant') is browsing, let them see drafts inside their store
    if (user && checkRole(['tenant'], user) && tenantId) {
      const staffQuery: Where = {
        tenant: {
          equals: tenantId,
        },
      }
      return staffQuery
    }

    // 4. Public Customers & Unauthenticated traffic can only see PUBLISHED items
    const publicQuery: Where = {
      _status: {
        equals: 'published',
      },
    }
    return publicQuery
  }
}

/**
 * Write Access: Restricts mutations (Create, Update, Delete) strictly to
 * Global Admins or the matching Tenant Store Manager.
 */
export const staffTenantWriteAccess = (): Access => {
  return ({ req: { user } }) => {
    // Deny unauthenticated users immediately
    if (!user) return false
    
    // Global Platform Admins pass through unconditionally
    if (checkRole(['admin'], user)) return true

    // Extract store scope identifier safely
    const assignedTenants = (user as any)?.tenants
    let tenantId: string | null = null

    if (assignedTenants) {
      if (Array.isArray(assignedTenants) && assignedTenants.length > 0) {
        tenantId = typeof assignedTenants[0] === 'object' ? assignedTenants[0]?.id : assignedTenants[0]
      } else {
        tenantId = typeof assignedTenants === 'object' ? assignedTenants?.id : assignedTenants
      }
    }

    // Store Managers can only touch data within their workspace bounds
    if (checkRole(['tenant'], user) && tenantId) {
      const managerQuery: Where = {
        tenant: {
          equals: tenantId,
        },
      }
      return managerQuery
    }

    return false
  }
}