import { FastifyInstance } from 'fastify'
import { listPlans } from './controllers/listPlans'
import { registerPlans } from './controllers/registerPlans'
import { DeletePlans } from './controllers/deletePlans'

export async function appRoutesPlans(app: FastifyInstance) {
  app.post('/plans', registerPlans)
  app.get('/plans', listPlans)
  // app.patch('/patient/:id', updatePatient)
  app.delete('/plans/:id', DeletePlans)
}
