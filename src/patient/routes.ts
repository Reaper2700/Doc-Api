import { FastifyInstance } from 'fastify'
import { list } from './controllers/list'
import { updatePatient } from './controllers/update'

import { register } from './controllers/register'
import { DeletePatient } from './controllers/delete'

export async function appRoutesPatient(app: FastifyInstance) {
  app.post('/patient', register)
  app.get('/patient', list)
  app.patch('/patient/:id', updatePatient)
  app.delete('/patient/:id', DeletePatient)
}
