import { FastifyInstance } from 'fastify'
import { list } from './controllers/list'
import { updatePatient } from './controllers/update'
import { DeletePatient } from './controllers/delete'
import { register } from './controllers/register'

export async function appRoutesPatient(app: FastifyInstance) {
  app.post('/patient', register)
  app.get('/patient', list)
  app.patch('/patient/:id', updatePatient)
  app.delete('/patient/:id', DeletePatient)
}
