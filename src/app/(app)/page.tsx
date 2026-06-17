import React from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import "@/app/(app)/globals.css"

type Props = {
  params: Promise<{ slug: string }>
}

// 1. Notice the 'async' keyword here
export default async function CentralPlatformHomePage() {
  const host = (await headers()).get('host') || ''

const hostname = host.split(':')[0]
const parts = hostname.split('.')

const requestedSubdomain =
  parts.length > 1 &&
  parts[0] !== 'localhost' &&
  parts[0] !== 'www'
    ? parts[0]
    : null

const tenant = await fetchTenantByDomain(host)

if (requestedSubdomain && !tenant) {
  notFound()
}

  // 🌐 CONDITION A: Show the central platform hub if accessing the naked domain
  if (!tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Multi-Tenant SaaS E-commerce
          </h1>
          <p className="text-sm text-gray-600">
            Welcome to the central commerce orchestration platform engine. Access your store using your custom merchant subdomain.
          </p>
          
          <div className="pt-4 border-t border-gray-100 space-y-3 flex flex-col">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Local Test Storefronts
            </p>
            <a 
              href="http://store1.localhost:3000/" 
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              → Go to Store 1 (store1.localhost:3000)
            </a>
            <a 
              href="http://store2.localhost:3000/" 
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              → Go to Store 2 (store2.localhost:3000)
            </a>
          </div>

          <div className="pt-4">
            <a
              href="http://localhost:3000/admin"
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Open Central Payload Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 🛒 CONDITION B: If a tenant subdomain is matched, fetch its dynamic homepage from Payload CMS
  const payload = await getPayload({ config: configPromise })
  
  const pageRes = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      and: [
        { slug: { equals: 'home' } },      // Matches the home page record
        { tenant: { equals: tenant.id } } // Scopes down to this tenant only
      ]
    }
  })

  const page = pageRes.docs[0]

  // Fallback if the store exists but they haven't configured a "home" page record yet
  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <h1 className="text-2xl font-bold">Welcome to {tenant.slug.toUpperCase()}</h1>
        <p className="text-gray-500 mt-2">
          Storefront isolated successfully! Create a page with the slug "home" in your admin dashboard to begin designing.
        </p>
      </div>
    )
  }

  // Render the specific tenant blocks built in Payload
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      {page.layout ? <RenderBlocks blocks={page.layout} /> : null}
    </main>
  )
}