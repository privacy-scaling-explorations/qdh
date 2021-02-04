const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = (_ => {
  if (Boolean(process.env.ANALYZE) === true) {
    return require('@next/bundle-analyzer')({ enabled: true })
  } else {
    return {}
  }
})()

module.exports = withPlugins([[withBundleAnalyzer]], {
  async rewrites() {
    return [
      {
        source: `/api/qdh-general-config`,
        destination: `${process.env.NEXT_PUBLIC_STRAPI_URL}/qdh-general-config`,
      },
      {
        source: `/api/tally/:filename`,
        destination: `https://qdh.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/assets/:filename`,
      },
    ]
  },
})
