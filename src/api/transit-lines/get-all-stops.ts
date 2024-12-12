/**
 * Controller for retrieving all transit stops with optional filtering
 * @module api/transit-lines/get-all-stops
 *
 * This controller provides functionality to retrieve all transit stops across all lines,
 * with optional filtering capabilities based on various stop attributes.
 */

import { Request, Response } from 'express'
import { lineService } from 'src/services/lineService'
import { TransitStop } from 'src/types/line'

/**
 * Interface defining possible filter criteria for stops
 * @interface FilterQuery
 */
interface FilterQuery {
  peopleOn?: number                  // Minimum number of people boarding at stop
  peopleOff?: number                 // Minimum number of people alighting at stop
  reachablePopulationWalk?: number   // Minimum population reachable by walking
  reachablePopulationBike?: number   // Minimum population reachable by biking
}

/**
 * Retrieves all transit stops with optional filtering based on query parameters
 *
 * @param req Express request object containing filter criteria
 * @param res Express response object
 * @returns HTTP response with filtered array of transit stops
 *
 * @example
 * GET /transit-lines/stops?peopleOn=10&reachablePopulationWalk=5000
 */
export async function getAllStops(req: Request<{}, {}, {}, FilterQuery>, res: Response) {
  const filters = req.query

  // Step 1: Retrieve all transit lines from service
  const lines = lineService.getAllLines()

  // Step 2: Collect all stops from all lines into a single array
  let allStops: TransitStop[] = []
  Object.values(lines).forEach(line => {
    allStops = allStops.concat(line.stops)
  })

  // Step 3: Apply filters if they exist
  const filteredStops = allStops.filter(stop => {
    let matchesFilter = true

    // Apply each filter criterion if specified
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

  // Step 4: Return filtered results
  res.status(200).send(filteredStops)
}