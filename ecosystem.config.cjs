// PM2 Configuration for Bank of Israel Chatbot Demo
module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring to prevent conflicts with Wrangler
      instances: 1, // Single instance for development
      exec_mode: 'fork'
    }
  ]
};