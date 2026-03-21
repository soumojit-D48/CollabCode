import axios from "axios"
import { logger } from '@collab/shared'
import { ExecuteInput } from '../validators/execute.validator'

const JUDGE0_URL    = process.env.JUDGE0_URL    ?? 'https://api.judge0.com'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY ?? ''

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 93,
  typescript: 94,
  python:     71,
  go:         95,
  rust:       73,
  java:       91,
  cpp:        54,
  c:          50,
}

export interface ExecuteResult {
  stdout:      string
  stderr:      string
  exitCode:    number
  time:        string   // seconds e.g. "0.042"
  memory:      number   // KB
  status:      string   // "Accepted", "Runtime Error", etc.
}

const headers: Record<string, string> = {
    'Content-Type':      'application/json',
    'X-RapidAPI-Key':    JUDGE0_API_KEY,
    'X-RapidAPI-Host':   'judge0-ce.p.rapidapi.com',
}
if (JUDGE0_API_KEY) {
  headers['X-Auth-Token'] = JUDGE0_API_KEY
}

export const executeCode = async (input: ExecuteInput): Promise<ExecuteResult> => {
  const languageId = LANGUAGE_IDS[input.language]
  if (!languageId) throw new Error(`Unsupported language: ${input.language}`)

  const submitRes = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
    {
      source_code: input.code,
      language_id: languageId,
      stdin:        input.stdin ?? '',
    },
    { headers }
  )

  const token = submitRes.data.token
  if (!token) throw new Error('No submission token from Judge0')

  logger.info('Code submitted to Judge0', { token, language: input.language })

  for (let attempt = 0; attempt < 10; attempt++) {
    await sleep(1000)

    const resultRes = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      { headers }
    )

    const data = resultRes.data

    if (data.status.id <= 2) {
      logger.debug('Still processing...', { attempt, status: data.status.description })
      continue
    }

    logger.info('Execution complete', {
      token,
      status: data.status.description,
      time: data.time,
    })

    return {
      stdout:   data.stdout   ?? '',
      stderr:   data.stderr   ?? data.compile_output ?? '',
      exitCode: data.exit_code ?? 0,
      time:     data.time      ?? '0',
      memory:   data.memory    ?? 0,
      status:   data.status.description,
    }
  }

  throw new Error('Execution timed out — no result after 10 seconds')
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))