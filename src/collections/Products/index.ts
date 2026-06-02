// import type { CollectionConfig } from 'payload'
// import { slugField } from 'payload'
// import {
//   FixedToolbarFeature,
//   HeadingFeature,
//   HorizontalRuleFeature,
//   InlineToolbarFeature,
//   lexicalEditor,
// } from '@payloadcms/richtext-lexical'

// export const Products: CollectionConfig = {
//   slug: 'products',
//   access: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//     delete: () => true,
//   },
//   versions: {
//     drafts: true,
//   },
//   admin: {
//     useAsTitle: 'title',
//     defaultColumns: ['title', 'tenant', '_status'],
//   },
//   fields: [
//     {
//       name: 'title',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'description',
//       type: 'richText',
//       editor: lexicalEditor({
//         features: ({ rootFeatures }) => [
//           ...rootFeatures,
//           HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
//           FixedToolbarFeature(),
//           InlineToolbarFeature(),
//           HorizontalRuleFeature(),
//         ],
//       }),
//     },
//     {
//       name: 'priceInUSD',
//       type: 'number',
//       required: true,
//     },
//     {
//       name: 'gallery',
//       type: 'array',
//       fields: [
//         {
//           name: 'image',
//           type: 'upload',
//           relationTo: 'media',
//           required: true,
//         },
//       ],
//     },
//     {
//       name: 'categories',
//       type: 'relationship',
//       hasMany: true,
//       relationTo: 'categories',
//       admin: { position: 'sidebar' },
//     },
//     {
//       name: 'relatedProducts',
//       type: 'relationship',
//       hasMany: true,
//       relationTo: 'products',
//     },
//     slugField(),
//   ],
// }

import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { publicTenantReadAccess, staffTenantWriteAccess } from '../../access/contentAccess'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: publicTenantReadAccess(),
    create: staffTenantWriteAccess(),
    update: staffTenantWriteAccess(),
    delete: staffTenantWriteAccess(),
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tenant', '_status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    {
      name: 'priceInUSD',
      type: 'number',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      hasMany: true,
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      hasMany: true,
      relationTo: 'products',
    },
    slugField(),
  ],
}