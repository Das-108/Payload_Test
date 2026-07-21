import React from 'react'
import { Footer as FooterType, Tenant } from '@/payload-types'
import Link from 'next/link'

interface FooterProps {
  data: FooterType | null
  tenant: Tenant | null
}

export const Footer: React.FC<FooterProps> = ({ data, tenant }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-8 gap-6">
          <div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              {tenant?.name || 'Storefront Platform'}
            </span>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              Powered by our dynamic multi-tenant e-commerce core framework.
            </p>
          </div>
          
          {/* Loop over structural array links injected from Payload */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {data?.navItems && data.navItems.length > 0 ? (
              data.navItems.map((item: any) => {
                if (!item?.link?.label) return null
                return (
                  <Link
                    key={item.id}
                    href={item.link.url || '#'}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {item.link.label}
                  </Link>
                )
              })
            ) : (
              <span className="text-xs text-zinc-400 italic">
                No custom footer footer navigation configured.
              </span>
            )}
          </nav>
        </div>

        {/* Bottom Attributions */}
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between text-xs text-zinc-400 dark:text-zinc-500 gap-4">
          <p>&copy; {currentYear} {tenant?.name || 'Platform'}. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}