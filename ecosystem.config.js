module.exports = {
  apps : [{
    name: 'allowlist',
    script: './build/index.js',
    instances: "max",
    watch: '.'
  }]
};
