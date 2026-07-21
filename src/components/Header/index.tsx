import React from 'react'
import { Header as HeaderType, Tenant } from '@/payload-types'
import Link from 'next/link'

interface HeaderProps {
  data: HeaderType | null
  tenant: Tenant | null
}

export const Header: React.FC<HeaderProps> = ({ data, tenant }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo / Mapped Tenant Name */}
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white hover:opacity-90 transition-opacity"
          >
            {tenant?.name || 'Storefront Platform'}
          </Link>
        </div>

        {/* Dynamic Multi-Tenant Navigation links */}
        <nav className="hidden md:flex items-center space-x-8">
          {data?.navItems && data.navItems.length > 0 ? (
            data.navItems.map((item: any) => {
              if (!item?.link?.label) return null
              return (
                <Link
                  key={item.id}
                  href={item.link.url || '#'}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
                >
                  {item.link.label}
                </Link>
              )
            })
          ) : (
            <span className="text-xs text-zinc-400 italic">
              No custom header navigation links defined.
            </span>
          )}
        </nav>

        {/* Action Blocks (Cart / Authentication placeholders) */}
        <div className="flex items-center space-x-4">
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Products
          </Link>

          <Link
            href="/cart"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Cart
          </Link>

          <Link
            href="/account"
            className="rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all"
          >
            Account
          </Link>
        </div>
      </div>
    </header>
  )
}
