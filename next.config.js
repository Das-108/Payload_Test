import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        protocol: 'http',
      },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path((?!api|_next|favicon\\.ico).*)',
        has: [
          {
            type: 'host',
            value: '(?<tenant>[^.]+)\\.localhost',
          },
        ],
        destination: '/:tenant/:path*',
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
