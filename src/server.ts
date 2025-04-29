import { app } from './app'
import { env } from './env'
import fastifyCors from '@fastify/cors'

// CORS no Fastify
app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running')
  })
