import { env } from './env'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

// API routes
const api = new Hono()

api.get('/hello', c => {
  return c.json({ message: 'Hello from API!' })
})

app.route('/api', api)

// Serve static files from web build (production)
app.use('/*', serveStatic({ root: './public' }))
app.use('/*', serveStatic({ root: './public', path: 'index.html' })) // SPA fallback

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  info => {
    console.log(`Server running at http://localhost:${info.port}`)
  }
)
