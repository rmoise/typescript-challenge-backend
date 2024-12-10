import { Storage } from './storage'
import { TransitLine, TransitStop } from 'src/types/line'

export class LineService {
  private lines: { [lineId: string]: TransitLine }

  constructor() {
    this.lines = Storage.load() // Load from storage instead of LINES directly
  }

  private saveChanges(): void {
    Storage.save(this.lines)
  }

  /**
   * Check wehter a line exists
   * @param lineId Id of the line to be checked
   */
  hasLine(lineId: string): boolean {
    return !!this.lines[lineId]
  }

  /**
   * Get a line by it's id
   * @param lineId Id of the line
   */
  getLine(lineId: string): TransitLine {
    return this.lines[lineId]
  }

  /**
   * Add a new line
   * @param newLineId New id of the line. Cannot be an id that already exists
   * @param stops Array of stops for the new line. Note: A line needs a minimum of two stops.
   */
  addLine(newLineId: string, stops: TransitStop[]): boolean {
    // Check if line ID already exists
    if (this.lines[newLineId]) {
      console.log('Line ID already exists')
      return false
    }

    // Check minimum stops requirement
    if (!stops || stops.length < 2) {
      console.log('Line needs at least 2 stops')
      return false
    }

    // Create new line
    const newLine: TransitLine = {
      id: newLineId,
      stops: stops
    }

    // Add to lines collection
    this.lines[newLineId] = newLine

    // Save changes to storage
    this.saveChanges()
    return true
  }

  /**
   * Add a stop to a line
   * @param lineId Id of the line
   * @param stop the stop you want to add
   * @param reference id of a reference stop
   * @param position defines if the new stop is added before or after the existing stop
   * @returns boolean indicating if addition was successful
   */
  addStop(lineId: string, stop: TransitStop, reference: string, position: 'before' | 'after' = 'after'): boolean {
    console.log('Adding stop to line:', lineId)
    const line = this.lines[lineId]
    if (!line) {
      console.log('Line not found')
      return false
    }

    console.log('Finding reference stop:', reference)
    const referenceStop = line.stops.find((s) => s.id === reference)
    if (!referenceStop) {
      console.log('Reference stop not found')
      return false
    }

    console.log('Reference stop found:', referenceStop.name)
    // Set up connections based on position
    if (position === 'after') {
      const nextStop = line.stops.find((s) => s.id === referenceStop.nextId)

      stop.prevId = referenceStop.id
      stop.nextId = referenceStop.nextId

      referenceStop.nextId = stop.id
      if (nextStop) nextStop.prevId = stop.id
    } else {
      const prevStop = line.stops.find((s) => s.id === referenceStop.prevId)

      stop.nextId = referenceStop.id
      stop.prevId = referenceStop.prevId

      referenceStop.prevId = stop.id
      if (prevStop) prevStop.nextId = stop.id
    }

    // Find the index where to insert the new stop
    const referenceIndex = line.stops.findIndex((s) => s.id === reference)
    const insertIndex = position === 'after' ? referenceIndex + 1 : referenceIndex

    // Insert the new stop
    line.stops.splice(insertIndex, 0, stop)

    this.saveChanges()
    return true
  }

  /**
   * Delete a stop from a line
   * @param lineId Id of the line
   * @param stopId Id of the stop to delete
   * @returns boolean indicating if deletion was successful
   */
  deleteStop(lineId: string, stopId: string): boolean {
    const line = this.lines[lineId]
    if (!line) return false

    const stopIndex = line.stops.findIndex((stop) => stop.id === stopId)
    if (stopIndex === -1) return false

    // Can't delete if it would leave less than 2 stops
    if (line.stops.length <= 2) return false

    const stop = line.stops[stopIndex]
    const prevStop = line.stops.find((s) => s.id === stop.prevId)
    const nextStop = line.stops.find((s) => s.id === stop.nextId)

    // Update connections between previous and next stops
    if (prevStop) prevStop.nextId = stop.nextId
    if (nextStop) nextStop.prevId = stop.prevId

    // Remove the stop from the array
    line.stops.splice(stopIndex, 1)
    const success = true
    if (success) {
      this.saveChanges()
    }
    return success
  }

  /**
   * Edit a stop's properties
   * @param lineId Id of the line
   * @param stopId Id of the stop to edit
   * @param updates Partial updates to apply to the stop
   * @returns boolean indicating if update was successful
   */
  editStop(lineId: string, stopId: string, updates: Partial<TransitStop>): boolean {
    console.log('Editing stop:', stopId, 'in line:', lineId)
    console.log('Updates:', updates)

    const line = this.lines[lineId]
    if (!line) {
      console.log('Line not found:', lineId)
      return false
    }

    const stop = line.stops.find((s) => s.id === stopId)
    if (!stop) {
      console.log('Stop not found:', stopId)
      return false
    }

    // Only allow updating these fields
    const allowedUpdates = {
      name: updates.name,
      lat: updates.lat,
      lng: updates.lng,
      peopleOn: updates.peopleOn,
      peopleOff: updates.peopleOff,
      reachablePopulationWalk: updates.reachablePopulationWalk,
      reachablePopulationBike: updates.reachablePopulationBike,
    }

    // Apply valid updates
    Object.entries(allowedUpdates).forEach(([key, value]) => {
      if (value !== undefined) {
        stop[key] = value
        console.log(`Updated ${key} to:`, value)
      }
    })

    console.log('Stop updated successfully')
    const success = true
    if (success) {
      this.saveChanges()
    }
    return success
  }

  getAllLines(): { [lineId: string]: TransitLine } {
    return this.lines
  }
}

export const lineService = new LineService()
