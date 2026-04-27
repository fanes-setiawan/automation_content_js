import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiRoutes from './routes/api.js';

const app = new Hono();

app.use('*', cors());

// Load API routes
app.route('/api', apiRoutes);

// Export default untuk Cloudflare Workers
export default app;
