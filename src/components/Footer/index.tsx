import React from 'react'
import { Footer as FooterType, Tenant } from '@/payload-types'
import Link from 'next/link'

interface FooterProps {
  data: FooterType | null
  tenant: Tenant | null
}

export const Footer: React.FC<FooterProps> = ({ data, tenant }) => {
  // Fallback if no footer is created yet in the Admin panel
  if (!data) {
    return (
      <footer className="p-8 mt-auto border-t bg-gray-50 text-center">
        <p>© {new Date().getFullYear()} {tenant?.name}. Please set up Footer in Admin.</p>
      </footer>
    )
  }

  return (
    <footer className="bg-white border-t p-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-bold text-lg">
          {tenant?.name}
        </div>

        <nav className="flex gap-6">
          {data.navItems?.map((item: any) => (
            <Link 
              key={item.id} 
              href={item.link.url || '#'} 
              className="text-gray-600 hover:text-black transition-colors"
            >
              {item.link.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}