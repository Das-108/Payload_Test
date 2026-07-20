import { Carts } from '@/collections/Carts'
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
import { addItemHandler } from './endpoints/cart/add-item'
import { clearCartHandler } from './endpoints/cart/clear-cart'
import { getCartHandler } from './endpoints/cart/get-cart'
import { removeItemHandler } from './endpoints/cart/remove-item'
import { updateItemHandler } from './endpoints/cart/update-item'

import { Addresses } from '@/collections/Addresses'
import { Categories } from '@/collections/Categories'
import { Footer } from '@/collections/Footer'
import { Header } from '@/collections/Header'
import { Media } from '@/collections/Media'
import { Orders } from '@/collections/Orders'
import { Pages } from '@/collections/Pages'
import { Products } from '@/collections/Products'
import { Users } from '@/collections/Users'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Tenants } from './collections/Tenant'

import { checkRole } from '@/access/utilities'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerSideURL(),

  collections: [
    Users,
    Pages,
    Categories,
    Media,
    Tenants,
    Products,
    Addresses,
    Header,
    Footer,
    Carts,
    Orders,
  ],

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

  endpoints: [
    { path: '/cart', method: 'get', handler: getCartHandler },
    { path: '/cart/add', method: 'post', handler: addItemHandler },
    { path: '/cart/remove', method: 'post', handler: removeItemHandler },
    { path: '/cart/update', method: 'post', handler: updateItemHandler },
    { path: '/cart/clear', method: 'delete', handler: clearCartHandler },
  ],

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
        addresses: {
          useBaseFilter: false,
          useTenantAccess: false,
        },
        header: {},
        footer: {},
        carts: {},
        orders: {},
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
