import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'

export async function deleteStop(req: Request<{ lineId: string; stopId: string }>, res: Response) {
  const { lineId, stopId } = req.params

  const success = lineService.deleteStop(lineId, stopId)
  if (success) {
    res.status(200).send({ message: 'Stop deleted successfully' })
  } else {
    res.status(400).send({ error: 'Could not delete stop' })
  }
} 