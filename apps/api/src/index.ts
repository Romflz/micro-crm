import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import env from './env'

const app = new Hono()

// API routes
const api = new Hono()

api.get('/hello', c => c.json({ message: 'Hello from API!' }))

app.route('/api', api)

// Serve static files from web build (production)
app.use('/*', serveStatic({ root: './public' }))
app.use('/*', serveStatic({ root: './public', path: 'index.html' })) // SPA fallback

serve(
  {
    fetch: app.fetch,
    port: env.DB_PORT,
  },
  info => {
    console.log(`Server running at http://localhost:${info.port}`)
  }
)
