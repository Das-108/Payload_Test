import React from 'react'
import { headers } from 'next/headers' // <--- Add this at line 1
import { notFound } from 'next/navigation'
import { fetchTenantByDomain } from '@/utilities/fetchTenantByDomain'
import { getTenantNavigation } from '@/utilities/getTenantData'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }> | any
}) {
  // 1. Await params for Next.js 15
  const resolvedParams = await params
  const tenantSlug = resolvedParams?.tenant

  const headersList = await headers()
  const host = headersList.get('host') || ''

  // 2. Fetch the tenant
  const tenant = await fetchTenantByDomain(host, tenantSlug)
  
  // CRITICAL: Check if tenant exists BEFORE using tenant.id
  if (!tenant) {
    console.error(`No tenant found for host: ${host} or slug: ${tenantSlug}`)
    return notFound() 
  }

  // 3. Only fetch nav if tenant is valid
  const { headerData, footerData } = await getTenantNavigation(tenant.id)
  console.log('Current Tenant ID:', tenant?.id);
  
  return (
    <div data-tenant={tenant.slug} className="min-h-screen flex flex-col">
      <Header data={headerData} tenant={tenant} />
      <main className="grow">{children}</main>
      <Footer data={footerData} tenant={tenant} />
    </div>
  )
}
