import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
// 🟢 IMPORT: Bring in your interactive checkout action button component

export default async function CheckoutPage() {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  // 1. Resolve tenant context boundary safely
  const tenant = await fetchTenantByDomain(host)
  if (!tenant) return notFound()

  const payload = await getPayload({ config: configPromise })

  // 2. 🟢 FIXED DESTRUCTURING: Safely pull the user profile out of payload.auth
  const { user } = await payload.auth({ headers: headersList })

  // 3. 🛡️ SECURITY SAFEGUARD: If no user session is active on this subdomain, bounce them to login
  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent('/checkout')}&warning=${encodeURIComponent('Please log in to complete your purchase.')}`,
    )
  }

  // 4. 🛒 TARGETED FETCH: Safely isolate the user's specific cart for this active tenant store
  const cartQuery = await payload.find({
    collection: 'carts',
    where: {
      and: [
        {
          tenant: {
            equals: tenant.id,
          },
        },
        {
          user: {
            equals: user.id,
          },
        },
      ],
    },
  })

  const activeCart = cartQuery.docs[0]

  return (
    <div className="container mx-auto py-12 px-4 text-slate-900">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Secure Checkout</h1>

      {!activeCart || !activeCart.items || activeCart.items.length === 0 ? (
        <div className="p-8 border border-dashed rounded-xl text-center bg-gray-50">
          <p className="text-gray-500">Your shopping cart is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping / Specification Panel (Left Side) */}
          <div className="lg:col-span-7 bg-white p-6 border rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Shipping & Order Specifications</h2>
              <p className="text-sm text-gray-500 mb-6">
                Processing transactional order flow for store:{' '}
                <strong className="text-indigo-600">{tenant.name}</strong>
              </p>
              <div className="border p-4 rounded-lg bg-slate-50 text-sm space-y-1">
                <p>
                  <strong>Customer Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Account Scope ID:</strong> {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Summary Columns Display Panel (Right Side) */}
          <div className="lg:col-span-5 bg-gray-50 p-6 border rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary Overview</h2>
            <div className="space-y-3">
              {activeCart.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                  <div>
                    {/* Access deep relation safely through optional chaining */}
                    <p className="font-medium text-gray-800">
                      {item.product?.title || 'Product Item'}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ${(item.priceSnapshot * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between items-center text-base font-bold pt-4 text-slate-900 border-t mt-4">
                <span>Calculated Subtotal:</span>
                <span className="text-xl text-indigo-600">${activeCart.subtotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
