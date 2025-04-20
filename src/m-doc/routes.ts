import { FastifyInstance } from 'fastify'
import { registerMedicUseCase } from './controllers/registerMedic'
import { ListMedic } from './controllers/listMedic'
import { DeleteMedic } from './controllers/deleteMedic'
import { UpdateMedic } from './controllers/updateMedic'

export async function appRoutesMedic(app: FastifyInstance) {
  app.post('/medic', registerMedicUseCase)
  app.get('/medic', ListMedic)
  app.patch('/medic/:id', UpdateMedic)
  app.delete('/medic/:id', DeleteMedic)
}
