// import { Grid } from '@/components/Grid'
// import { ProductGridItem } from '@/components/ProductGridItem'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
// import React from 'react'

// type SearchParams = { [key: string]: string | string[] | undefined }
// type Props = {
//   params: Promise<{ tenant: string }>
//   searchParams: Promise<SearchParams>
// }

// export default async function ShopPage({ params, searchParams }: Props) {
//   const { tenant } = await params
//   const { q: searchValue, sort, category } = await searchParams
//   const payload = await getPayload({ config: configPromise })

//   const products = await payload.find({
//     collection: 'products',
//     overrideAccess: true,
//     select: { title: true, slug: true, gallery: true, categories: true, priceInUSD: true },
//     ...(sort ? { sort } : { sort: 'title' }),
//     where: {
//       and: [
//         { 'tenant.slug': { equals: tenant } },
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
//           {products.docs.length === 0
//             ? 'There are no products that match '
//             : `Showing ${products.docs.length} ${resultsText} for `}
//           <span className="font-bold">&quot;{searchValue}&quot;</span>
//         </p>
//       ) : null}
//       {!searchValue && products.docs.length === 0 && (
//         <p className="mb-4">No products found.</p>
//       )}
//       {products.docs.length > 0 ? (
//         <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.docs.map((product) => (
//             <ProductGridItem key={product.id} product={product} />
//           ))}
//         </Grid>
//       ) : null}
//     </div>
//   )
// }


import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'

export default async function CheckoutPage() {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  const tenant = await fetchTenantByDomain(host)
  if (!tenant) return notFound()

  const payload = await getPayload({ config: configPromise })

  const cart = await payload.find({
    collection: 'orders', // adjust if different in your schema
    where: {
      and: [
        {
          tenant: { equals: tenant.id },
        },
        {
          status: { equals: 'pending' },
        },
      ],
    },
  })

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {cart.docs.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty</p>
      ) : (
        <div className="mt-6">
          {/* your checkout UI stays unchanged */}
          <pre>{JSON.stringify(cart.docs, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}