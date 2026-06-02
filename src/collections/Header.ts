import type { CollectionConfig } from 'payload'
import { link } from '@/fields/link'

export const Header: CollectionConfig = {
  slug: 'header',
  admin: {
    group: 'Navigation',
    useAsTitle: 'id',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !req.user.roles?.includes('admin') && req.user.tenants?.[0]) {
          const tenantEntry = req.user.tenants[0]
          const tenantId = typeof tenantEntry.tenant === 'object'
            ? tenantEntry.tenant.id
            : tenantEntry.tenant
          if (tenantId) return { ...data, tenant: tenantId }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [link({ appearances: false })],
      maxRows: 6,
    },
  ],
}