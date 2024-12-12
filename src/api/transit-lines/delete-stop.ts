/**
 * Controller for deleting a stop from a transit line
 * @module api/transit-lines/delete-stop
 *
 * This controller handles the removal of stops from transit lines.
 * It ensures both the line and stop exist before attempting deletion.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'

/**
 * Request parameters interface for deleting a stop
 * @interface DeleteStopRequest
 */
interface DeleteStopRequest {
  /** ID of the line containing the stop */
  lineId: string
  /** ID of the stop to delete */
  stopId: string
}

/**
 * Handles the deletion of a stop from a transit line
 *
 * @param req Express request object containing line ID and stop ID
 * @param res Express response object
 * @returns HTTP response with success/error message
 *
 * @throws {400} If line or stop does not exist
 */
export async function deleteStop(req: Request<DeleteStopRequest>, res: Response) {
  const { lineId, stopId } = req.params

  const success = lineService.deleteStop(lineId, stopId)
  if (success) {
    res.status(200).send({ message: 'Stop deleted successfully' })
  } else {
    res.status(400).send({ error: 'Could not delete stop' })
  }
}