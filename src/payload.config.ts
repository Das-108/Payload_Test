// import { postgresAdapter } from '@payloadcms/db-postgres'
// import {
//   BoldFeature,
//   EXPERIMENTAL_TableFeature,
//   IndentFeature,
//   ItalicFeature,
//   LinkFeature,
//   OrderedListFeature,
//   UnderlineFeature,
//   UnorderedListFeature,
//   lexicalEditor,
// } from '@payloadcms/richtext-lexical'
// import path from 'path'
// import { buildConfig } from 'payload'
// import { fileURLToPath } from 'url'

// import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
// import { Categories } from '@/collections/Categories'
// import { Media } from '@/collections/Media'
// import { Pages } from '@/collections/Pages'
// import { Products } from '@/collections/Products'
// import { Users } from '@/collections/Users'
// import { Tenants } from './collections/Tenant'
// import { Addresses } from '@/collections/Addresses'
// import { Header } from '@/collections/Header'
// import { Footer } from '@/collections/Footer'


// import { getServerSideURL } from './utilities/getURL'
// import { checkRole } from '@/access/utilities'
// import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

// const filename = fileURLToPath(import.meta.url)
// const dirname = path.dirname(filename)

// export default buildConfig({
//   serverURL: getServerSideURL(),
//   cors: [
//     getServerSideURL(),
//     'http://store1.localhost:3000',
//     'http://store2.localhost:3000',
//     'http://test.localhost:3000',
//   ],
//   csrf: [
//     getServerSideURL(),
//     'http://store1.localhost:3000',
//     'http://store2.localhost:3000',
//     'http://test.localhost:3000',
//   ],
//   admin: {
//     user: Users.slug,
//     importMap: {
//       baseDir: path.resolve(dirname),
//     },
//   },
//   collections: [Users, Pages, Categories, Media, Tenants, Products, Addresses, Header, Footer],
//   db: postgresAdapter({
//     pool: {
//       connectionString: process.env.DATABASE_URL || '',
//     },
//   }),
//   editor: lexicalEditor({
//     features: () => [
//       UnderlineFeature(),
//       BoldFeature(),
//       ItalicFeature(),
//       OrderedListFeature(),
//       UnorderedListFeature(),
//       LinkFeature({ enabledCollections: ['pages'] }),
//       IndentFeature(),
//       EXPERIMENTAL_TableFeature(),
//     ],
//   }),
//   plugins: [
//     formBuilderPlugin({
//       fields: { payment: false },
//     }),
//     multiTenantPlugin({
//       collections: {
//         pages: {},
//         media: {},
//         products: {},
//         categories: {},
//         addresses: {},
//         header: {},
//         footer: {},
//       },
//       tenantField: {
//         name: 'tenant',
//         access: {
//           read: () => true,
//           update: ({ req: { user } }) => Boolean(user && checkRole(['admin'], user)),
//         },
//       },
//       userHasAccessToAllTenants: (user) => Boolean(user && checkRole(['admin'], user)),
//     }),
//   ],
//   secret: process.env.PAYLOAD_SECRET || '',
//   typescript: {
//     outputFile: path.resolve(dirname, 'payload-types.ts'),
//   },
// })

import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Products } from '@/collections/Products'
import { Users } from '@/collections/Users'
import { Tenants } from './collections/Tenant'
import { Addresses } from '@/collections/Addresses'
import { Header } from '@/collections/Header'
import { Footer } from '@/collections/Footer'

import { getServerSideURL } from './utilities/getURL'
import { checkRole } from '@/access/utilities'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)


export default buildConfig({
  serverURL: getServerSideURL(),
  cors: [
    getServerSideURL(),
    'http://store1.localhost:3000',
    'http://store2.localhost:3000',
    'http://test.localhost:3000',
  ],
  csrf: [
    getServerSideURL(),
    'http://store1.localhost:3000',
    'http://store2.localhost:3000',
    'http://test.localhost:3000',
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Pages, Categories, Media, Tenants, Products, Addresses, Header, Footer],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor({
    features: () => [
      UnderlineFeature(),
      BoldFeature(),
      ItalicFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      LinkFeature({ enabledCollections: ['pages'] }),
      IndentFeature(),
      EXPERIMENTAL_TableFeature(),
    ],
  }),
  plugins: [
    formBuilderPlugin({
      fields: { payment: false },
    }),
    multiTenantPlugin({
      collections: {
        pages: {},
        media: {},
        products: {},
        categories: {},
        addresses: {},
        header: {},
        footer: {},
      },
      tenantField: {
        name: 'tenant',
        access: {
          read: () => true,
          update: ({ req: { user } }) => Boolean(user && checkRole(['admin'], user)),
        },
      },
      userHasAccessToAllTenants: (user) => Boolean(user && checkRole(['admin'], user)),
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})