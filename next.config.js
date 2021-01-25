const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: `https://qdh-admin.ksaitor.com/admin/:path*`,
        permanent: false
      },
    ]
  },
})
