import type { Field } from 'payload'

export const tenantSlug = (): Field => {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    index: true,
    hooks: {
      beforeValidate: [
        async ({ value, data, req, operation, originalDoc }) => {
          if (!value) return value

          const tenantId =
            typeof data?.tenant === 'object'
              ? data?.tenant?.id
              : data?.tenant

          if (!tenantId) return value

          const existing = await req.payload.find({
            collection: 'pages',
            where: {
              and: [
                { slug: { equals: value } },
                { tenant: { equals: tenantId } },
              ],
            },
          })

          const isDuplicate = existing.docs.some(
            (doc) => doc.id !== originalDoc?.id
          )

          if (isDuplicate) {
            throw new Error('Slug already exists for this tenant')
          }

          return value
        },
      ],
    },
  }
}