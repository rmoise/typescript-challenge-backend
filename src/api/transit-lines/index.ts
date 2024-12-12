/**
 * Transit Lines API Router Configuration
 * @module api/transit-lines
 *
 * This module configures all routes for the transit lines API.
 * It includes endpoints for managing transit lines and their stops.
 */

import { Router } from 'express'
import { getLine } from './get-line'
import { deleteStop } from './delete-stop'
import { addStop } from './add-stop'
import { editStop } from './edit-stop'
import { addLine } from './add-line'
import { getAllStops } from './get-all-stops'
import { getAllLines } from './get-all-lines'
import { deleteLine } from './delete-line'

// Create router instance
export const transitLinesRouter = Router()

// Stop-related routes
transitLinesRouter.get('/stops', getAllStops)  // Get all stops (with optional filtering)
transitLinesRouter.delete('/:lineId/stops/:stopId', deleteStop)  // Delete a specific stop
transitLinesRouter.post('/:lineId/stops/:referenceId', addStop)  // Add a new stop
transitLinesRouter.put('/:lineId/stops/:stopId', editStop)  // Update a stop's properties

// Line-related routes
transitLinesRouter.get('/:lineId', getLine)  // Get a specific line
transitLinesRouter.post('/:lineId', addLine)  // Create a new line
transitLinesRouter.get('/', getAllLines)  // Get all lines
transitLinesRouter.delete('/:lineId', deleteLine)  // Delete a line
