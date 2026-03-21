import { Router } from 'express'
import { Request, Response, NextFunction } from 'express'
import { authenticate, AuthRequest } from '@collab/shared'
import { listFiles, create, update, remove } from '../controllers/file.controller'

const asAuth = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req as AuthRequest, res, next)

const router = Router({ mergeParams: true })

router.use(authenticate)

router.get('/',          asAuth(listFiles))
router.post('/',         asAuth(create))
router.patch('/:fileId', asAuth(update))
router.delete('/:fileId',asAuth(remove))

export default router