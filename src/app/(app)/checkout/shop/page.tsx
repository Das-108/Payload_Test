// // import { Grid } from '@/components/Grid'
// // import { ProductGridItem } from '@/components/ProductGridItem'
// // import configPromise from '@payload-config'
// // import { getPayload } from 'payload'
// // import React from 'react'

// // export const metadata = {
// //   description: 'Search for products in the store.',
// //   title: 'Shop',
// // }

// // type SearchParams = { [key: string]: string | string[] | undefined }

// // type Props = {
// //   params: Promise<{ tenant: string }>
// //   searchParams: Promise<SearchParams>
// // }

// // export default async function ShopPage({ params, searchParams }: Props) {
// //   const { tenant } = await params
// //   const { q: searchValue, sort, category } = await searchParams
// //   const payload = await getPayload({ config: configPromise })

// //   const products = await payload.find({
// //     collection: 'products',
// //     draft: false,
// //     overrideAccess: false,
// //     select: {
// //       title: true,
// //       slug: true,
// //       gallery: true,
// //       categories: true,
// //       priceInUSD: true,
// //     },
// //     ...(sort ? { sort } : { sort: 'title' }),
// //     where: {
// //       and: [
// //         { 'tenant.slug': { equals: tenant } },
// //         ...(searchValue ? [{ or: [
// //           { title: { like: searchValue } },
// //           { description: { like: searchValue } },
// //         ]}] : []),
// //         ...(category ? [{ categories: { contains: category } }] : []),
// //       ],
// //     },
// //   })

// //   const resultsText = products.docs.length > 1 ? 'results' : 'result'

// //   return (
// //     <div>
// //       {searchValue ? (
// //         <p className="mb-4">
// //           {products.docs?.length === 0
// //             ? 'There are no products that match '
// //             : `Showing ${products.docs.length} ${resultsText} for `}
// //           <span className="font-bold">&quot;{searchValue}&quot;</span>
// //         </p>
// //       ) : null}
// //       {!searchValue && products.docs?.length === 0 && (
// //         <p className="mb-4">No products found. Please try different filters.</p>
// //       )}
// //       {products?.docs.length > 0 ? (
// //         <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {products.docs.map((product) => (
// //             <ProductGridItem key={product.id} product={product} tenantSlug={tenant} />
// //           ))}
// //         </Grid>
// //       ) : null}
// //     </div>
// //   )
// // }

// import { Grid } from '@/components/Grid'
// import { ProductGridItem } from '@/components/ProductGridItem'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
// import React from 'react'
// import { headers } from 'next/headers'
// import { notFound } from 'next/navigation'
// import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

// export const metadata = {
//   description: 'Search for products in the store.',
//   title: 'Shop',
// }

// type SearchParams = { [key: string]: string | string[] | undefined }

// type Props = {
//   searchParams: Promise<SearchParams>
// }

// export default async function ShopPage({ searchParams }: Props) {
//   // 1. Intercept the dynamic host details straight from headers
//   const headersList = await headers()
//   const host = headersList.get('host') || ''

//   // 2. Resolve the matching merchant context from your ecom database
//   const tenant = await fetchTenantByDomain(host)
//   if (!tenant) return notFound()

//   const { q: searchValue, sort, category } = await searchParams
//   const payload = await getPayload({ config: configPromise })

//   // 3. Query your index, matching records strictly against the Tenant ID mapping
//   const products = await payload.find({
//     collection: 'products',
//     draft: false,
//     overrideAccess: false,
//     select: {
//       title: true,
//       slug: true,
//       gallery: true,
//       categories: true,
//       priceInUSD: true,
//     },
//     ...(sort ? { sort } : { sort: 'title' }),
//     where: {
//       and: [
//         {
//           tenant: { equals: tenant.id }
//         },
//         ...(searchValue ? [{ or: [
//           { title: { like: searchValue } },
//           { description: { like: searchValue } },
//         ]}] : []),
//         ...(category ? [{ categories: { contains: category } }] : []),
//       ],
//     },
//   })

//   const resultsText = products.docs.length > 1 ? 'results' : 'result'

//   return (
//     <div>
//       {searchValue ? (
//         <p className="mb-4">
//           {products.docs?.length === 0
//             ? 'There are no products that match '
//             : `Showing ${products.docs.length} ${resultsText} for `}
//           <span className="font-bold">&quot;{searchValue}&quot;</span>
//         </p>
//       ) : null}
//       {!searchValue && products.docs?.length === 0 && (
//         <p className="mb-4">No products found. Please try different filters.</p>
//       )}
//       {products?.docs.length > 0 ? (
//         <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.docs.map((product) => (
//             <ProductGridItem key={product.id} product={product} tenantSlug={tenant.slug} />
//           ))}
//         </Grid>
//       ) : null}
//     </div>
//   )
// }

import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

type SearchParams = {
  [key: string]: string | string[] | undefined
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  const tenant = await fetchTenantByDomain(host)
  if (!tenant) return notFound()

  const { q: searchValue, sort, category } = await searchParams

  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    where: {
      and: [
        {
          tenant: { equals: tenant.id },
        },
        ...(searchValue
          ? [
              {
                or: [{ title: { like: searchValue } }, { description: { like: searchValue } }],
              },
            ]
          : []),
        ...(category ? [{ categories: { contains: category } }] : []),
      ],
    },
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <p className="mb-4">
          {products.docs.length === 0
            ? 'There are no products that match '
            : `Showing ${products.docs.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs.length === 0 && <p className="mb-4">No products found.</p>}

      {products.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.docs.map((product) => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </Grid>
      ) : null}
    </div>
  )
}
