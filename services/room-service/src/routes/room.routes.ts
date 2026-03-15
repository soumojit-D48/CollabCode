import { Router } from 'express'
import { Request, Response, NextFunction } from 'express'
import { authenticate, AuthRequest } from '@collab/shared'
import {
  create, getOne, getMyRooms, listPublic,
  update, remove, join, leave, changeRole,
} from '../controllers/room.controller'

const asAuth = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req as AuthRequest, res, next)

const router = Router()

router.use(authenticate)

router.post('/',                 asAuth(create))
router.get('/me',                asAuth(getMyRooms))
router.get('/public',            asAuth(listPublic))
router.get('/:roomId',           asAuth(getOne))
router.patch('/:roomId',         asAuth(update))
router.delete('/:roomId',        asAuth(remove))
router.post('/:roomId/join',     asAuth(join))
router.post('/:roomId/leave',    asAuth(leave))
router.patch('/:roomId/members', asAuth(changeRole))

export default router