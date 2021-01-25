const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: `/api/qdh-general-config`,
        destination: `https://strapi-admin.quadratic.page/qdh-general-config`,
      },
    ]
  },
})
