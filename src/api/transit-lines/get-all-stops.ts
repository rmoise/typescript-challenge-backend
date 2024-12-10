import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

interface FilterQuery {
  peopleOn?: number
  peopleOff?: number
  reachablePopulationWalk?: number
  reachablePopulationBike?: number
}

export async function getAllStops(req: Request<{}, {}, {}, FilterQuery>, res: Response) {
  const filters = req.query

  // Get all lines
  const lines = lineService.getAllLines()

  // Collect all stops from all lines
  let allStops: TransitStop[] = []
  Object.values(lines).forEach(line => {
    allStops = allStops.concat(line.stops)
  })

  // Apply filters if they exist
  const filteredStops = allStops.filter(stop => {
    let matchesFilter = true

    if (filters.peopleOn !== undefined) {
      matchesFilter = matchesFilter && stop.peopleOn >= filters.peopleOn
    }
    if (filters.peopleOff !== undefined) {
      matchesFilter = matchesFilter && stop.peopleOff >= filters.peopleOff
    }
    if (filters.reachablePopulationWalk !== undefined) {
      matchesFilter = matchesFilter && stop.reachablePopulationWalk >= filters.reachablePopulationWalk
    }
    if (filters.reachablePopulationBike !== undefined) {
      matchesFilter = matchesFilter && stop.reachablePopulationBike >= filters.reachablePopulationBike
    }

    return matchesFilter
  })

  res.status(200).send(filteredStops)
}