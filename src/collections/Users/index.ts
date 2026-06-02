import type { CollectionConfig } from 'payload'

import { setCookieBasedOnDomain } from './hooks/setCookieBasedOnDomain'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Keep this!
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
  access: {    
    // TEMPORARILY allow everyone to do everything so you can register
    admin: () => true, 
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    group: 'Users',
    useAsTitle: 'email', // Changed from 'name' because email is guaranteed to exist
  },
  fields: [
    // tenant assignments are managed automatically by the multi-tenant plugin
    // (the plugin adds a `tenants` relationship field to users).  we keep the
    // field definition here in comments for reference but remove it to avoid
    // duplicate-field errors.
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'], // Make sure the first user gets the role
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Tenant', value: 'tenant' },
        { label: 'Customer', value: 'customer' },
      ],
    },
  ],
}