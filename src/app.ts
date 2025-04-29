import fastify from 'fastify'
import { appRoutesPatient } from './patient/routes'
import { appRoutesMedic } from './m-doc/routes'
import { appRoutesPlans } from './Plans/routes'

export const app = fastify()

app.register(appRoutesPatient)
app.register(appRoutesMedic)
app.register(appRoutesPlans)
