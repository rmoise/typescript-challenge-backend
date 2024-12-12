/**
 * Controller for adding a new stop to a transit line
 * @module api/transit-lines/add-stop
 *
 * This controller handles the addition of new stops to existing transit lines.
 * It supports adding stops before or after an existing reference stop.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

/**
 * Request parameters interface for adding a stop
 * @interface AddStopRequest
 */
interface AddStopRequest {
  /** ID of the line to add the stop to */
  lineId: string
  /** ID of the reference stop to position the new stop relative to */
  referenceId: string
}

/**
 * Request body interface for adding a stop
 * @interface AddStopBody
 */
interface AddStopBody {
  /** The new stop to add */
  stop: TransitStop
  /** Whether to add the stop 'before' or 'after' the reference stop */
  position: 'before' | 'after'
}

/**
 * Handles the addition of a new stop to a transit line
 *
 * @param req Express request object containing line ID, reference stop ID, and new stop data
 * @param res Express response object
 * @returns HTTP response with success/error message
 *
 * @throws {400} If line does not exist
 * @throws {400} If reference stop does not exist
 */
export async function addStop(req: Request<AddStopRequest, {}, AddStopBody>, res: Response) {
  console.log('Request params:', req.params)
  console.log('Request body:', req.body)

  const { lineId, referenceId } = req.params
  const { stop, position } = req.body

  const success = lineService.addStop(lineId, referenceId, stop, position)
  console.log('Add stop result:', success)

  if (success) {
    res.status(200).send({ message: 'Stop added successfully' })
  } else {
    res.status(400).send({ error: 'Could not add stop' })
  }
}
