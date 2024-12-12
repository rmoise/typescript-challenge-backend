/**
 * Controller for deleting a transit line from the system
 * @module api/transit-lines/delete-line
 *
 * This controller handles the removal of transit lines from the system.
 * It ensures the line exists before attempting deletion.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'

/**
 * Request parameters interface for deleting a line
 * @interface DeleteLineRequest
 */
interface DeleteLineRequest {
  /** ID of the line to delete */
  lineId: string
}

/**
 * Handles the deletion of a transit line
 *
 * @param req Express request object containing the line ID
 * @param res Express response object
 * @returns HTTP response with success/error message
 *
 * @throws {400} If line does not exist or cannot be deleted
 */
export async function deleteLine(req: Request<DeleteLineRequest>, res: Response) {
  const { lineId } = req.params

  const success = lineService.deleteLine(lineId)

  if (success) {
    res.status(200).send({ message: 'Line deleted successfully' })
  } else {
    res.status(400).send({ error: 'Could not delete line. Line might not exist.' })
  }
}