import { app } from './app' // Supondo que seu app seja uma instância do Fastify
import { env } from './env'
import fastifyCors from '@fastify/cors' // Importando o plugin correto

// Registre o plugin CORS no Fastify
app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite o frontend rodando em localhost:3000
})

// Agora, o servidor vai escutar nas configurações fornecidas
app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running')
  })
