module.exports = {
  apps : [{
    name: 'allowlist',
    script: './build/index.js',
    instances: "max",
    watch: '.',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
