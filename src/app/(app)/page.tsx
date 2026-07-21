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
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        
        {/* HERO SECTION */}
        <header className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-slate-950 pt-24 pb-20 md:pt-32 md:pb-28 border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="space-y-6 lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Multi-Tenant Commerce Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Launch, manage, and scale multiple online stores
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Create isolated storefronts, manage products, orders, customers, and dynamic content—all orchestrated from a single runtime ecosystem.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="http://localhost:3000/admin"
                  className="px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 duration-200"
                >
                  Create Store
                </a>
                <a
                  href="http://localhost:3000/admin"
                  className="px-6 py-3 border border-slate-700 text-base font-semibold rounded-lg text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all duration-200"
                >
                  Login to Dashboard
                </a>
              </div>
            </div>

            {/* Mockup Display */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-slate-700/50 rounded-2xl p-4 shadow-2xl shadow-indigo-950/50 backdrop-blur-sm">
              <div className="w-full h-full rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/40"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/40"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/40"></span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">payload.config.ts</span>
                </div>
                <div className="flex-1 font-mono text-xs text-indigo-400/80 p-2 space-y-2 overflow-hidden select-none">
                  <p className="text-slate-500">// Merchant Database Scoping Engine</p>
                  <p><span className="text-purple-400">const</span> tenantContext = fetchTenantByDomain(host)</p>
                  <p><span className="text-purple-400">return</span> payload.find(&#123;</p>
                  <p className="pl-4">collection: <span className="text-amber-300">'pages'</span>,</p>
                  <p className="pl-4">where: &#123; tenant: &#123; equals: tenantContext.id &#125; &#125;</p>
                  <p>&#125;)</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Global Orchestration Hub</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">v3.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MERCHANT GATEWAY HUB SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-slate-950 border border-indigo-500/20 rounded-2xl p-8 max-w-3xl mx-auto text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Development Hub</h2>
              <p className="text-xl font-bold text-white">Isolated Tenant Test Gateways</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a 
                href="http://store1.localhost:3000/" 
                className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all text-left duration-200"
              >
                <div className="text-xs text-slate-500 font-mono mb-1">Subdomain 01</div>
                <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">Store 1 →</div>
                <div className="text-xs text-slate-400 mt-1">store1.localhost:3000</div>
              </a>
              <a 
                href="http://store2.localhost:3000/" 
                className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all text-left duration-200"
              >
                <div className="text-xs text-slate-500 font-mono mb-1">Subdomain 02</div>
                <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">Store 2 →</div>
                <div className="text-xs text-slate-400 mt-1">store2.localhost:3000</div>
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for Core Multi-Tenancy
            </h2>
            <p className="text-slate-400">
              A comprehensive toolkit tailored to handle high-performance merchant virtualization seamlessly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">01</div>
              <h3 className="text-lg font-bold text-white">Tenant Isolation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Each merchant gets a fully isolated storefront with independent products, pages, orders, and settings config.</p>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">02</div>
              <h3 className="text-lg font-bold text-white">Centralized Management</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Control all distributed stores, globally validate collections, and clean structures out of one Payload CMS dashboard.</p>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">03</div>
              <h3 className="text-lg font-bold text-white">Custom Domains</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Map dedicated domain configurations or route through automated nested multi-level subdomain structures instantly.</p>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">04</div>
              <h3 className="text-lg font-bold text-white">Dynamic Content</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Build highly flexible landing schemas directly inside Payload layouts via reusable core engine block layers.</p>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">05</div>
              <h3 className="text-lg font-bold text-white">Secure Access</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Granular access token checking loops protect merchant boundaries natively against unwanted administrative leak vectors.</p>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">06</div>
              <h3 className="text-lg font-bold text-white">Scalable Architecture</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Engineered with Next.js App Router, Payload CMS, PostgreSQL, and performant server data hydration pipes.</p>
            </div>
          </div>
        </section>

        {/* PLATFORM OVERVIEW (ARCHITECTURE) */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Platform Overview</h2>
            <p className="text-slate-400">One Control Core. Unlimited Isolated Merchant Channels.</p>
          </div>
          <div className="inline-block p-6 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-indigo-400 whitespace-pre text-left overflow-x-auto max-w-full shadow-inner shadow-black">
{`          ┌──────────────────────────────────┐
          │     Payload Admin Dashboard      │
          └────────────────┬─────────────────┘
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
┌───────────┐        ┌───────────┐        ┌───────────┐
│  Store A  │        │  Store B  │        │  Store C  │
└───────────┘        └───────────┘        └───────────┘`}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How It Works</h2>
            <p className="text-slate-400">Four straightforward steps to provision complete merchant isolation layers.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-bold">STEP 01</div>
              <h4 className="font-bold text-white text-lg">Create Tenant</h4>
              <p className="text-sm text-slate-400">Register a new merchant entity within the multi-tenant registry config mapping layer.</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-bold">STEP 02</div>
              <h4 className="font-bold text-white text-lg">Configure Storefront</h4>
              <p className="text-sm text-slate-400">Inject standalone localized store configurations, independent item objects, and theme variables.</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-bold">STEP 03</div>
              <h4 className="font-bold text-white text-lg">Publish Instantly</h4>
              <p className="text-sm text-slate-400">Expose isolated live records right away across targeted edge subdomain parameter rules.</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-bold">STEP 04</div>
              <h4 className="font-bold text-white text-lg">Grow Operations</h4>
              <p className="text-sm text-slate-400">Monitor unified global transaction sets while ensuring strict local storage query boundaries.</p>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY STACK SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Powered by Modern Technologies</h2>
            <p className="text-slate-400">Built using best-in-class open-source infrastructure tools.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <span className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white hover:border-slate-700 transition-colors">Next.js 15</span>
            <span className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white hover:border-slate-700 transition-colors">Payload CMS v3</span>
            <span className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white hover:border-slate-700 transition-colors">PostgreSQL</span>
            <span className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white hover:border-slate-700 transition-colors">TypeScript</span>
            <span className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white hover:border-slate-700 transition-colors">Tailwind CSS</span>
          </div>
        </section>

        {/* CTA OUTRO */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60 text-center">
          <div className="max-w-3xl mx-auto space-y-6 bg-gradient-to-b from-indigo-950/30 to-transparent border border-slate-800 p-12 rounded-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Launch Your Store?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
              Provision high-performance architectural commerce nodes directly with absolute functional data isolation rules.
            </p>
            <div className="pt-2">
              <a
                href="http://localhost:3000/admin"
                className="inline-flex px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/10"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; 2026 Core Commerce System Hub Engine. All data boundaries enforced.
        </footer>
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
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100">
        <div className="max-w-md w-full text-center space-y-4 border border-slate-800 bg-slate-900/50 p-8 rounded-xl backdrop-blur">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Isolation Mode Active</span>
          <h1 className="text-2xl font-bold text-white">Welcome to {tenant.name || tenant.slug.toUpperCase()}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Storefront routing isolated successfully! Log in to your workspace dashboard and configure a page with the slug <code className="text-indigo-300 font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">"home"</code> to start designing content layout sections.
          </p>
          <div className="pt-2">
            <a href={`http://localhost:3000/admin`} className="text-xs text-indigo-400 hover:underline">Open Admin Control Panel →</a>
          </div>
        </div>
      </div>
    )
  }

  // Render the specific tenant blocks built in Payload
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      {page.layout ? <RenderBlocks blocks={page.layout} /> : null}
    </main>
  )
}