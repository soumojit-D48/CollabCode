import { Router } from 'express'
import { execute } from '../controllers/execute.controller'

const router = Router()

router.post('/', execute)

export default router