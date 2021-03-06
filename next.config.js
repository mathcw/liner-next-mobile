const withCss = require('@zeit/next-css');
const isProd = process.env.NODE_ENV === 'production'
const assetPrefix = isProd?'':'';
const basePath = isProd?'':'';

if (typeof require !== undefined){
    require.extensions['.css'] = file => {
        
    }
}

module.exports = withCss({
    webpack: (config, { isServer }) => {
        if (isServer) {
          const antStyles = /antd-mobile\/.*?\/style.*?/
          const antdStyles = /antd\/.*?\/style.*?/
          const origExternals = [...config.externals]
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback()
              if (request.match(antdStyles)) return callback()
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
          config.module.rules.unshift({
            test: antdStyles,
            use: 'null-loader',
          })
        }
        return config
    },
    assetPrefix:assetPrefix,
    publicRuntimeConfig: {
        basePath
    },
})
