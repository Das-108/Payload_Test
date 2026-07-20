import type { Access, Where } from 'payload' // Import Where
import type { User } from '@/payload-types'
import { checkRole } from '@/access/utilities'

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false

  if (checkRole(['admin'], user)) {
    return true
  }

  if (user.tenants) {
    const tenantId =
      Array.isArray(user.tenants) && user.tenants.length > 0
        ? typeof user.tenants[0].tenant === 'object'
          ? user.tenants[0].tenant.id
          : user.tenants[0].tenant
        : null

    // Explicitly typing this as 'Where' usually clears the "index signature" error
    const query: Where = {
      or: [
        {
          id: {
            equals: user.id,
          },
        },
        {
          tenant: {
            equals: tenantId,
          },
        },
      ],
    }
    return query
  }

  return {
    id: {
      equals: user.id,
    },
  }
}
