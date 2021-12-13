module.exports = {
  apps : [{
    name: 'allowlist',
    script: './build/index.js',
    instances: "max",
    exec_mode: 'cluster',
    watch: '.',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      DEBUG: "custom:*"
    }
  }]
};
