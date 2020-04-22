const env = require("./env-config.js")
const path = require("path")

module.exports = {
  env,
  exportTrailingSlash: true,
  exportPathMap: () => generatePathMap(),
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style\/css.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
      
    }
    config.node = {
      fs: 'empty',
      module: "empty",
    };
    config.resolve.alias['static'] = path.join(__dirname, './public');
    return config
  },
}

///////////////////////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////////////////////

async function generatePathMap() {
  return {
    '/': { page: '/' },
    '/devices': { page: '/devices' },
    "/devices/:id": {page: "devices/[item]"},
    '/proofs': { page: '/proofs' },
    '/proofs/function': { page: '/proofs/function' },
  }
}
