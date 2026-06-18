import { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    // 🟢 REMOVED: The manual 'tenant' field block has been removed.
    // The multi-tenant plugin handles injecting it automatically, preventing the 500 error!
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'priceSnapshot',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      defaultValue: 0,
    },
  ],
}