module.exports = {
  apps: [
    {
      name: 'upperfloor',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3010
      }
    }
  ]
};
