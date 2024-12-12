import { Router } from 'express'
import { getLine } from './get-line'
import { deleteStop } from './delete-stop'
import { addStop } from './add-stop'
import { editStop } from 'src/api/transit-lines/edit-stop'
import { addLine } from './add-line'
import { getAllStops } from './get-all-stops'
import { getAllLines } from './get-all-lines'
import { deleteLine } from './delete-line'

export const transitLinesRouter = Router()

transitLinesRouter.get('/stops', getAllStops)
transitLinesRouter.get('/:lineId', getLine)
transitLinesRouter.delete('/:lineId/stops/:stopId', deleteStop)
transitLinesRouter.post('/:lineId/stops/:referenceId', addStop)
transitLinesRouter.put('/:lineId/stops/:stopId', editStop)
transitLinesRouter.post('/:lineId', addLine)
transitLinesRouter.get('/', getAllLines)
transitLinesRouter.delete('/:lineId', deleteLine)

// TODO add other CRUD methods
