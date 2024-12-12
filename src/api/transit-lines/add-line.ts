import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

interface AddLineRequest {
  lineId: string
}

interface AddLineBody {
  stops: TransitStop[]
}

export async function addLine(req: Request<AddLineRequest, {}, AddLineBody>, res: Response) {
  console.log('Add line request:', req.params, req.body)

  const { lineId } = req.params
  const { stops } = req.body

  // Check if line exists first
  const existingLine = lineService.getLine(lineId)
  if (existingLine) {
    return res.status(400).send({
      error: 'Could not create line. Line ID might already exist.'
    })
  }

  // Then check for minimum stops requirement
  if (!stops || stops.length < 2) {
    return res.status(400).send({
      error: 'Could not create line. At least 2 stops are required.'
    })
  }

  const success = lineService.addLine(lineId, stops)
  console.log('Add line result:', success)

  if (success) {
    res.status(201).send({ message: 'Line added successfully' })
  } else {
    res.status(400).send({
      error: 'Could not create line. Line ID might already exist.'
    })
  }
} 