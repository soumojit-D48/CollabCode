import 'dotenv/config'
import app from './app'
import { logger } from '@collab/shared'

const PORT = process.env.PORT ?? 3005

app.listen(PORT, () => {
  logger.info(`Execution service running on port ${PORT}`)
})