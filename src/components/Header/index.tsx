import React from 'react'
import { Header as HeaderType, Tenant } from '@/payload-types'
import Link from 'next/link'

interface HeaderProps {
  data: HeaderType | null
  tenant: Tenant | null
}

export const Header: React.FC<HeaderProps> = ({ data, tenant }) => {
  // If no record exists for this tenant, you might want a fallback or return null
  if (!data) return <header className="p-4 border-b">Please create a Header in Admin for {tenant?.name}</header>

  return (
    <header className="flex items-center justify-between p-6 bg-white border-b">
      <div className="font-bold text-xl">
        {tenant?.name || 'My Store'}
      </div>
      <nav className="flex gap-4">
        {data.navItems?.map((item: any) => (
          <Link key={item.id} href={item.link.url || '#'}>
            {item.link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}