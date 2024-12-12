/**
 * Controller for editing an existing stop in a transit line
 * @module api/transit-lines/edit-stop
 *
 * This controller handles updates to stop properties while preserving
 * critical fields like ID and connectivity information.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

/**
 * Request parameters interface for editing a stop
 * @interface EditStopRequest
 */
interface EditStopRequest {
  /** ID of the line containing the stop */
  lineId: string
  /** ID of the stop to edit */
  stopId: string
}

/**
 * Request body type for stop updates
 * Allows partial updates while preventing changes to critical fields (id, prevId, nextId)
 * @type EditStopBody
 */
type EditStopBody = Partial<Omit<TransitStop, 'id' | 'prevId' | 'nextId'>>

/**
 * Handles updates to a stop's properties
 *
 * @param req Express request object containing line ID, stop ID, and update data
 * @param res Express response object
 * @returns HTTP response with success/error message
 *
 * @throws {400} If line does not exist
 * @throws {400} If stop does not exist
 */
export async function editStop(req: Request<EditStopRequest, {}, EditStopBody>, res: Response) {
  console.log('Edit stop request:', req.params, req.body)

  const { lineId, stopId } = req.params
  const updates = req.body

  const success = lineService.updateStop(lineId, stopId, updates)
  console.log('Edit stop result:', success)

  if (success) {
    res.status(200).send({ message: 'Stop updated successfully' })
  } else {
    res.status(400).send({ error: 'Could not update stop' })
  }
}