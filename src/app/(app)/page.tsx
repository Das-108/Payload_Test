import React from 'react'
import Link from 'next/link'

export default function CentralPlatformHomePage() {
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