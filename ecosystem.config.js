// PM2 Configuration File for Hostinger VPS / Node.js Web Hosting
module.exports = {
  apps: [
    {
      name: 'solusiniaga-erp',
      script: 'dist/server.cjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
