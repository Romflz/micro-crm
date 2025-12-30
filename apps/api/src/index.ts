import { env } from './env'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

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

export default {
  port: env.PORT,
  fetch: app.fetch,
}
