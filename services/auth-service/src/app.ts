import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from '@collab/shared'
import authRoutes from './routes/auth.routes'

const app = express()

app.use(helmet())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' })
})

app.use('/auth', authRoutes)

app.use(errorHandler)

export default app