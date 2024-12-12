/**
 * Controller for retrieving a specific transit line
 * @module api/transit-lines/get-line
 *
 * This controller handles requests to retrieve detailed information
 * about a specific transit line, including all its stops.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'

/**
 * Request parameters interface for getting a line
 * @interface GetLineRequest
 */
interface GetLineRequest {
  /** ID of the line to retrieve */
  lineId: string
}

/**
 * Handles retrieval of a specific transit line
 *
 * @param req Express request object containing the line ID
 * @param res Express response object
 * @returns HTTP response with line data or error message
 *
 * @throws {400} If line does not exist
 */
export async function getLine(req: Request<GetLineRequest>, res: Response) {
  const line = lineService.getLine(req.params.lineId)
  if (line) {
    res.status(200).send(line)
  } else {
    res.status(400).send({ error: 'Not found' })
  }
}
