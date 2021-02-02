const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: `/api/qdh-general-config`,
        destination: `${process.env.NEXT_PUBLIC_STRAPI_URL}/qdh-general-config`,
      },
      {
        source: `/api/tally/:filename`,
        destination: `https://qdh.blob.core.windows.net/qdh-user-images/assets/:filename`
      }
    ]
  },
})
