const { Hono } = require('hono');
const { cors } = require('hono/cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = new Hono();

app.use('*', cors());

// Load API routes
app.route('/api', apiRoutes);

// Export app untuk Cloudflare Workers
module.exports = {
  fetch: app.fetch,
};

// Jika ingin dijalankan secara lokal (bukan Cloudflare):
// const { serve } = require('@hono/node-server');
// const PORT = process.env.PORT || 3000;
// serve({ fetch: app.fetch, port: PORT }, () => {
//   console.log(\`Server lokal berjalan di http://localhost:\${PORT}\`);
// });
