import { Router } from 'express'
import { authenticate } from '@collab/shared'
import { register, login, me } from '../controllers/auth.controllers'
import { AuthRequest } from '@collab/shared'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.get('/me',        authenticate, (req, res) => me(req as AuthRequest, res))

export default router