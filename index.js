import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiRoutes from './routes/api.js';

const app = new Hono();

app.use('*', cors());

// Root route
app.get('/', (c) => {
  return c.json({
    status: 'online',
    message: 'Backend Automation Content JS is Running!',
    version: '1.0.0',
    endpoints: ['/api/workflow/start', '/api/generate/script', '/api/generate/video'],
  });
});

// Load API routes
app.route('/api', apiRoutes);

// Export default untuk Cloudflare Workers
export default app;
