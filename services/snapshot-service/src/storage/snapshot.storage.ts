import fs from 'fs/promises'
import path from 'path'
import { logger } from '@collab/shared'

const DIR = process.env.SNAPSHOT_DIR ?? './snapshots'

export const saveSnapshot = async (
  roomId: string,
  content: string
): Promise<void> => {
  await fs.mkdir(DIR, { recursive: true })

  const filename = `${roomId}-${Date.now()}.json`
  const filepath = path.join(DIR, filename)

  await fs.writeFile(
    filepath,
    JSON.stringify(
      { roomId, content, savedAt: new Date().toISOString() },
      null,
      2
    )
  )

  logger.info('Snapshot saved', { roomId, filename })
}

export const getLatestSnapshot = async (
  roomId: string
): Promise<string | null> => {
  try {
    const files = (await fs.readdir(DIR))
      .filter((f) => f.startsWith(roomId))
      .sort()
      .reverse()

    if (!files.length) return null

    const raw = await fs.readFile(path.join(DIR, files[0]), 'utf-8')
    return JSON.parse(raw).content
  } catch {
    return null
  }
}