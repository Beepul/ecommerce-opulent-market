module.exports = {
  apps: [
    {
      name: "server",
      script: "./server.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
  scripts: {
    start: "pm2-runtime start ecosystem.config.js --env production",
  },
};
