/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    turbo: {},
  },
  webpack: (config, { isServer }) => {
    // Module Federation placeholder for future micro-frontend architecture
    // Disabled for MVP; uncomment and adjust when splitting into remotes/hosts.
    // const { ModuleFederationPlugin } = require('webpack').container;
    // config.plugins.push(
    //   new ModuleFederationPlugin({
    //     name: 'pmsFrontend',
    //     filename: 'remoteEntry.js',
    //     remotes: {},
    //     exposes: {
    //       './TaskList': './src/components/tasks/TaskList',
    //     },
    //     shared: {
    //       react: { singleton: true, requiredVersion: false },
    //       'react-dom': { singleton: true, requiredVersion: false },
    //     },
    //   })
    // );

    return config;
  },
};

module.exports = nextConfig;
