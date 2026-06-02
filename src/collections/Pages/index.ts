// import type { CollectionConfig } from 'payload'
// import { Banner } from '@/blocks/Banner/config'
// import { Carousel } from '@/blocks/Carousel/config'
// import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
// import { generatePreviewPath } from '@/utilities/generatePreviewPath'
// import { Archive } from '@/blocks/ArchiveBlock/config'
// import { CallToAction } from '@/blocks/CallToAction/config'
// import { Content } from '@/blocks/Content/config'
// import { FormBlock } from '@/blocks/Form/config'
// import { MediaBlock } from '@/blocks/MediaBlock/config'
// import { hero } from '@/fields/hero'
// import { slugField } from 'payload'
// import {
//   MetaDescriptionField,
//   MetaImageField,
//   MetaTitleField,
//   OverviewField,
//   PreviewField,
// } from '@payloadcms/plugin-seo/fields'
// import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'

// export const Pages: CollectionConfig = {
//   slug: 'pages',
//   access: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//     delete: () => true,
//   },
//   admin: {
//     group: 'Content',
//     defaultColumns: ['title', 'slug', 'tenant', 'updatedAt'], // Added tenant here for easy viewing
//     livePreview: {
//       url: ({ data, req }) =>
//         generatePreviewPath({
//           slug: data?.slug,
//           collection: 'pages',
//           req,
//         }),
//     },
//     useAsTitle: 'title',
//   },
//   fields: [
//     {
//       name: 'title',
//       type: 'text',
//       required: true,
//     },    
//     {
//       name: 'publishedOn',
//       type: 'date',
//       admin: {
//         date: {
//           pickerAppearance: 'dayAndTime',
//         },
//         position: 'sidebar',
//       },
//       hooks: {
//         beforeChange: [
//           ({ siblingData, value }) => {
//             if (siblingData._status === 'published' && !value) {
//               return new Date()
//             }
//             return value
//           },
//         ],
//       },
//     },
//     {
//       type: 'tabs',
//       tabs: [
//         {
//           fields: [hero],
//           label: 'Hero',
//         },
//         {
//           fields: [
//             {
//               name: 'layout',
//               type: 'blocks',
//               blocks: [
//                 CallToAction,
//                 Content,
//                 MediaBlock,
//                 Archive,
//                 Carousel,
//                 ThreeItemGrid,
//                 Banner,
//                 FormBlock,
//               ],
//               required: true,
//             },
//           ],
//           label: 'Content',
//         },
//         {
//           name: 'meta',
//           label: 'SEO',
//           fields: [
//             OverviewField({
//               titlePath: 'meta.title',
//               descriptionPath: 'meta.description',
//               imagePath: 'meta.image',
//             }),
//             MetaTitleField({ hasGenerateFn: true }),
//             MetaImageField({ relationTo: 'media' }),
//             MetaDescriptionField({}),
//             PreviewField({
//               hasGenerateFn: true,
//               titlePath: 'meta.title',
//               descriptionPath: 'meta.description',
//             }),
//           ],
//         },
//       ],
//     },
//     slugField(),
//   ],
//   hooks: {
//     afterChange: [revalidatePage],
//     afterDelete: [revalidateDelete],
//   },
//   versions: {
//     drafts: {
//       autosave: true,
//     },
//     maxPerDoc: 50,
//   },
// }


import type { CollectionConfig } from 'payload'
import { Banner } from '@/blocks/Banner/config'
import { Carousel } from '@/blocks/Carousel/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { hero } from '@/fields/hero'
import { slugField } from 'payload'
import { publicTenantReadAccess, staffTenantWriteAccess } from '../../access/contentAccess'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: publicTenantReadAccess(),
    create: staffTenantWriteAccess(),
    update: staffTenantWriteAccess(),
    delete: staffTenantWriteAccess(),
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'tenant', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },    
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                Carousel,
                ThreeItemGrid,
                Banner,
                FormBlock,
              ],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}