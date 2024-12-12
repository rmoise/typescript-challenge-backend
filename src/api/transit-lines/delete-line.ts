import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'

interface DeleteLineRequest {
  lineId: string
}

export async function deleteLine(req: Request<DeleteLineRequest>, res: Response) {
  const { lineId } = req.params

  const success = lineService.deleteLine(lineId)

  if (success) {
    res.status(200).send({ message: 'Line deleted successfully' })
  } else {
    res.status(400).send({ error: 'Could not delete line. Line might not exist.' })
  }
} 