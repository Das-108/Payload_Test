import type { Access, CollectionConfig, PayloadRequest, Where } from 'payload'

const isAddressOwner: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.roles?.includes('admin')) return true

  if (!id) return true

  const address = await req.payload.findByID({
    collection: 'addresses',
    id: id as string | number,
    depth: 0,
    overrideAccess: false,
    user: req.user,
    req: req as PayloadRequest,
  })

  const ownerId = typeof address?.user === 'object' ? address.user?.id : address?.user

  return ownerId === req.user.id
}

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    group: 'Store Management',
    defaultColumns: ['name', 'city', 'user'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false

      if (req.user.roles?.includes('admin')) return true

      return {
        user: {
          equals: req.user.id,
        },
      }
    },

    create: ({ req }) => !!req.user,

    update: ({ req }) => {
      if (!req.user) return false

      if (req.user.roles?.includes('admin')) return true

      return {
        user: {
          equals: req.user.id,
        },
      }
    },

    delete: ({ req }) => {
      if (!req.user) return false

      if (req.user.roles?.includes('admin')) return true

      return {
        user: {
          equals: req.user.id,
        },
      }
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        console.log('[addresses-debug] beforeValidate', {
          userId: req.user?.id,
          data,
        })

        if (!req.user) return data

        return {
          ...data,
          user: req.user.id,
        }
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ req }) => req.user?.id,
      admin: {
        description: 'The account that owns this address',
      },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'line1', type: 'text', label: 'Address Line 1', required: true },
    { name: 'line2', type: 'text', label: 'Address Line 2' },
    { name: 'city', type: 'text', required: true },
    { name: 'state', type: 'text' },
  ],
}
