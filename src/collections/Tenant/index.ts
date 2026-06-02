import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isAdmin, // Only you can create new stores
    delete: isAdmin, // Only you can delete stores
    read: () => true, // Everyone can read (needed for public site)
    update: isAdmin, // Only you can change domain/slug settings
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
}