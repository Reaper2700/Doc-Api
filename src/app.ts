import fastify from 'fastify'
import { appRoutesPatient } from './patient/routes'
import { appRoutesMedic } from './m-doc/routes'
import { appRoutesPlans } from './Plans/routes'
import { appRoutesConsultation } from './Consultation/routes'
import fastifyMultipart from '@fastify/multipart'
import fastifyCors from '@fastify/cors'

export const app = fastify()

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Disposition'],
})

app.register(fastifyMultipart)
app.register(appRoutesPatient)
app.register(appRoutesMedic)
app.register(appRoutesPlans)
app.register(appRoutesConsultation)
