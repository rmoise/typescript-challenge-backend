/**
 * Controller for adding a new transit line to the system.
 * @module api/transit-lines/add-line
 *
 * This controller handles the creation of new transit lines with their associated stops.
 * It includes validation for line existence and minimum stop requirements.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

/**
 * Request parameters interface for adding a new line
 * @interface AddLineRequest
 */
interface AddLineRequest {
  lineId: string  // Unique identifier for the new line
}

/**
 * Request body interface containing the stops for the new line
 * @interface AddLineBody
 */
interface AddLineBody {
  stops: TransitStop[]  // Array of transit stops that make up the line
}

/**
 * Handles the addition of a new transit line
 *
 * @param req Express request object containing lineId and stops data
 * @param res Express response object
 * @returns HTTP response with success/error message
 *
 * @throws {400} If line already exists
 * @throws {400} If stops array is missing or has less than 2 stops
 */
export async function addLine(req: Request<AddLineRequest, {}, AddLineBody>, res: Response) {
  console.log('Add line request:', req.params, req.body)

  const { lineId } = req.params
  const { stops } = req.body

  // Validation Step 1: Check if line already exists
  const existingLine = lineService.getLine(lineId)
  if (existingLine) {
    return res.status(400).send({
      error: 'Could not create line. Line ID might already exist.'
    })
  }

  // Validation Step 2: Check minimum stops requirement
  if (!stops || stops.length < 2) {
    return res.status(400).send({
      error: 'Could not create line. At least 2 stops are required.'
    })
  }

  // Process: Attempt to add the new line
  const success = lineService.addLine(lineId, stops)
  console.log('Add line result:', success)

  // Response: Return appropriate status based on operation success
  if (success) {
    res.status(201).send({ message: 'Line added successfully' })
  } else {
    res.status(400).send({
      error: 'Could not create line. Line ID might already exist.'
    })
  }
} 