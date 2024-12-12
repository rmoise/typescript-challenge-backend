import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'

/**
 * Get all lines from the store
 */
export async function getAllLines(req: Request, res: Response) {
  const lines = lineService.getAllLines()
  res.status(200).send(Object.values(lines))
} 