// import type { CollectionConfig } from 'payload'

// export const Addresses: CollectionConfig = {
//   slug: 'addresses',
//   access: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//     delete: () => true,
//   },
//   fields: [
//     { name: 'name', type: 'text' },
//     { name: 'line1', type: 'text', label: 'Address Line 1' },
//     { name: 'line2', type: 'text', label: 'Address Line 2' },
//     { name: 'city', type: 'text' },
//     { name: 'state', type: 'text' },
//     { name: 'zip', type: 'text' },
//     { name: 'country', type: 'text' },
//     { name: 'user', type: 'relationship', relationTo: 'users' },
//   ],
// }

import type { CollectionConfig } from 'payload'
import { tenantIsolatedAccess } from '../../access/tenantFilters'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    group: 'Store Management',
    defaultColumns: ['name', 'city', 'user'],
  },
  access: {
    // Both reading and modifying addresses are now strictly gated by role and store context
    read: tenantIsolatedAccess(),
    create: tenantIsolatedAccess(),
    update: tenantIsolatedAccess(),
    delete: tenantIsolatedAccess(),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'line1', type: 'text', label: 'Address Line 1', required: true },
    { name: 'line2', type: 'text', label: 'Address Line 2' },
    { name: 'city', type: 'text', required: true },
    { name: 'state', type: 'text' },
    { name: 'zip', type: 'text', label: 'Postal / ZIP Code' },
    { name: 'country', type: 'text', required: true },
    { 
      name: 'user', 
      type: 'relationship', 
      relationTo: 'users',
      required: true,
      index: true,
    },
    // The 'tenant' field mapping is automatically injected here by the multiTenantPlugin
  ],
}