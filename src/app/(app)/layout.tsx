// import type { ReactNode } from 'react'
// import React from 'react'
// import { headers } from 'next/headers'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { GeistMono } from 'geist/font/mono'
// import { GeistSans } from 'geist/font/sans'
// import { AdminBar } from '@/components/AdminBar'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
// import { Providers } from '@/providers'
// import { InitTheme } from '@/providers/Theme/InitTheme'
// import { Header } from '@/components/Header'
// import "@/app/(app)/globals.css"

// export default async function RootLayout({ children }: { children: ReactNode }) {
//   const headerList = await headers()
//   const host = headerList.get('host') || 'localhost:3000'
  
//   // Clean up port mappings for standard domain checking (e.g., "localhost:3000" -> "localhost")
//   const cleanHostWithoutPort = host.split(':')[0]

//   const payload = await getPayload({ config: configPromise })

//   // 🧪 DEBUG LOG 1: Let's view the inbound request information in your terminal
//   console.log('====== [LAYOUT TENANT RESOLVER DEBUG] ======')
//   console.log('Inbound host from browser headers:', host)
//   console.log('Normalized host without port:', cleanHostWithoutPort)

//   // Fetch all existing tenants to see what values are stored in the database
//   const allTenants = await payload.find({
//     collection: 'tenants',
//     limit: 10,
//   })
  
//   console.log('Available tenants in DB:', allTenants.docs.map(t => ({ id: t.id, name: t.name, domain: t.domain, slug: t.slug })))

//   // 1. Primary Lookup: Try matching by literal host string or cleaned domain
//   let tenantQuery = await payload.find({
//     collection: 'tenants',
//     where: {
//       or: [
//         { domain: { equals: host } },
//         { domain: { equals: cleanHostWithoutPort } },
//         // Fallback option: Check if the subdomain matches the slug field directly
//         { slug: { equals: cleanHostWithoutPort.split('.')[0] } }
//       ]
//     },
//     limit: 1,
//   })

//   let currentTenant = tenantQuery.docs[0] || null

//   // Secondary Fallback: If no match is found, assign the very first tenant so the site displays data during local testing
//   if (!currentTenant && allTenants.docs.length > 0) {
//     console.log('⚠️ No exact tenant match found for domain. Falling back to first available tenant record for safety.')
//     currentTenant = allTenants.docs[0]
//   }

//   console.log('Resolved Active Tenant Context:', currentTenant ? `${currentTenant.name} (ID: ${currentTenant.id})` : 'NULL')

//   let headerData = null
//   let footerData = null

//   if (currentTenant) {
//     // 2. Query layouts matching the tenant link relation
//     const headerRes = await payload.find({
//       collection: 'header',
//       where: {
//         tenant: { equals: currentTenant.id },
//       },
//       limit: 1,
//     })

//     headerData = headerRes.docs[0] || null
    
//     console.log(`Resolved Header matching Tenant ID ${currentTenant.id}:`, headerData ? `Found (ID: ${headerData.id})` : 'NOT FOUND')
//   }
  
//   console.log('============================================')

//   return (
//     <html
//       className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
//       lang="en"
//       suppressHydrationWarning
//     >
//       <head>
//         <InitTheme />
//         <link href="/favicon.ico" rel="icon" sizes="32x32" />
//         <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
//       </head>
//       <body>
//         <Providers>
//           <AdminBar />
//           <LivePreviewListener />
          
//           <Header data={headerData} tenant={currentTenant} />
          
//           <main className="min-h-screen">
//             {children}
//           </main>
          
//         </Providers>
//       </body>
//     </html>
//   )
// }


import type { ReactNode } from 'react'
import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { AdminBar } from '@/components/AdminBar'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Header } from '@/components/Header'
// 1. Import the Footer component into the layout workspace
import { Footer } from '@/components/Footer'
import "@/app/(app)/globals.css"

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headerList = await headers()
  const host = headerList.get('host') || 'localhost:3000'
  
  // Clean up port mappings for standard domain checking (e.g., "localhost:3000" -> "localhost")
  const cleanHostWithoutPort = host.split(':')[0]

  const payload = await getPayload({ config: configPromise })

  // 🧪 DEBUG LOG 1: Let's view the inbound request information in your terminal
  console.log('====== [LAYOUT TENANT RESOLVER DEBUG] ======')
  console.log('Inbound host from browser headers:', host)
  console.log('Normalized host without port:', cleanHostWithoutPort)

  // Fetch all existing tenants to see what values are stored in the database
  const allTenants = await payload.find({
    collection: 'tenants',
    limit: 10,
  })
  
  console.log('Available tenants in DB:', allTenants.docs.map(t => ({ id: t.id, name: t.name, domain: t.domain, slug: t.slug })))

  // Primary Lookup: Try matching by literal host string or cleaned domain
  let tenantQuery = await payload.find({
    collection: 'tenants',
    where: {
      or: [
        { domain: { equals: host } },
        { domain: { equals: cleanHostWithoutPort } },
        // Fallback option: Check if the subdomain matches the slug field directly
        { slug: { equals: cleanHostWithoutPort.split('.')[0] } }
      ]
    },
    limit: 1,
  })

  let currentTenant = tenantQuery.docs[0] || null

  // Secondary Fallback: If no match is found, assign the very first tenant so the site displays data during local testing
  if (!currentTenant && allTenants.docs.length > 0) {
    console.log('⚠️ No exact tenant match found for domain. Falling back to first available tenant record for safety.')
    currentTenant = allTenants.docs[0]
  }

  console.log('Resolved Active Tenant Context:', currentTenant ? `${currentTenant.name} (ID: ${currentTenant.id})` : 'NULL')

  let headerData = null
  let footerData = null

  if (currentTenant) {
    // 2. Query layouts matching the tenant link relation for the Header
    const headerRes = await payload.find({
      collection: 'header',
      where: {
        tenant: { equals: currentTenant.id },
      },
      limit: 1,
    })
    headerData = headerRes.docs[0] || null
    console.log(`Resolved Header matching Tenant ID ${currentTenant.id}:`, headerData ? `Found (ID: ${headerData.id})` : 'NOT FOUND')

    // 3. Query layouts matching the tenant link relation for the Footer
    const footerRes = await payload.find({
      collection: 'footer',
      where: {
        tenant: { equals: currentTenant.id },
      },
      limit: 1,
    })
    footerData = footerRes.docs[0] || null
    console.log(`Resolved Footer matching Tenant ID ${currentTenant.id}:`, footerData ? `Found (ID: ${footerData.id})` : 'NOT FOUND')
  }
  
  console.log('============================================')

  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />
          
          {/* Main Top Header Navigation */}
          <Header data={headerData} tenant={currentTenant} />
          
          <main className="min-h-screen">
            {children}
          </main>

          {/* 4. Render the Dynamic Tenant Footer component at the bottom of the visible viewport */}
          <Footer data={footerData} tenant={currentTenant} />
        </Providers>
      </body>
    </html>
  )
}