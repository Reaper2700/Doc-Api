import fastify from 'fastify'
import { appRoutesPatient } from './patient/routes'
import { appRoutesMedic } from './m-doc/routes'

export const app = fastify()

app.register(appRoutesPatient)
app.register(appRoutesMedic)
