import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from '@collab/shared'
import roomRoutes from './routes/room.routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'room-service' })
})

app.use('/rooms', roomRoutes)

app.use(errorHandler)

export default app