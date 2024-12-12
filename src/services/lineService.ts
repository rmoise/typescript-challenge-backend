/**
 * Service for managing transit lines
 * @module services/lineService
 *
 * This service provides the core business logic for managing transit lines,
 * including CRUD operations for lines and stops. It maintains an in-memory
 * cache of lines and persists changes to storage.
 */

import { Storage } from './storage'
import { TransitLine, TransitStop } from 'src/types/line'

/**
 * Service class for managing transit lines and their stops
 * Provides methods for creating, reading, updating, and deleting transit lines
 */
class LineService {
  /** In-memory cache of transit lines indexed by line ID */
  private lines: { [lineId: string]: TransitLine }

  constructor() {
    // Load initial data from storage
    this.lines = Storage.load()
  }

  /**
   * Retrieves all transit lines from the system
   * @returns Object containing all transit lines indexed by line ID
   */
  getAllLines(): { [lineId: string]: TransitLine } {
    return this.lines
  }

  /**
   * Retrieves a specific transit line by ID
   * @param lineId - Unique identifier of the line to retrieve
   * @returns The requested transit line or undefined if not found
   */
  getLine(lineId: string): TransitLine | undefined {
    return this.lines[lineId]
  }

  /**
   * Adds a new transit line to the system
   * @param lineId - Unique identifier for the new line
   * @param stops - Array of stops that make up the line
   * @returns true if line was added successfully, false if line ID already exists
   */
  addLine(lineId: string, stops: TransitStop[]): boolean {
    // Check if line already exists
    if (this.lines[lineId]) {
      return false
    }

    // Create new line and persist to storage
    this.lines[lineId] = { id: lineId, stops }
    Storage.save(this.lines)
    return true
  }

  /**
   * Deletes a transit line from the system
   * @param lineId - Unique identifier of the line to delete
   * @returns true if line was deleted successfully, false if line not found
   */
  deleteLine(lineId: string): boolean {
    // Check if line exists
    if (!this.lines[lineId]) {
      return false
    }

    // Remove line and persist changes
    delete this.lines[lineId]
    Storage.save(this.lines)
    return true
  }

  /**
   * Updates a stop within a transit line
   * @param lineId - ID of the line containing the stop
   * @param stopId - ID of the stop to update
   * @param updates - Object containing the fields to update
   * @returns true if stop was updated successfully, false otherwise
   */
  updateStop(lineId: string, stopId: string, updates: Partial<TransitStop>): boolean {
    const line = this.lines[lineId]
    if (!line) return false

    const stopIndex = line.stops.findIndex(stop => stop.id === stopId)
    if (stopIndex === -1) return false

    // Update stop properties while preserving critical fields
    const stop = line.stops[stopIndex]
    line.stops[stopIndex] = {
      ...stop,
      ...updates,
      // Preserve critical fields
      id: stop.id,
      prevId: stop.prevId,
      nextId: stop.nextId
    }

    Storage.save(this.lines)
    return true
  }

  /**
   * Adds a new stop to a transit line
   * @param lineId - ID of the line to add the stop to
   * @param referenceStopId - ID of the stop to add the new stop before/after
   * @param newStop - The new stop to add
   * @param position - Whether to add the stop 'before' or 'after' the reference stop
   * @returns true if stop was added successfully, false otherwise
   */
  addStop(lineId: string, referenceStopId: string, newStop: TransitStop, position: 'before' | 'after'): boolean {
    const line = this.lines[lineId]
    if (!line) return false

    const refStopIndex = line.stops.findIndex(stop => stop.id === referenceStopId)
    if (refStopIndex === -1) return false

    // Update stop links based on position
    if (position === 'after') {
      const nextStop = line.stops[refStopIndex + 1]
      newStop.prevId = referenceStopId
      newStop.nextId = nextStop?.id || ''
      line.stops[refStopIndex].nextId = newStop.id
      if (nextStop) nextStop.prevId = newStop.id
    } else {
      const prevStop = line.stops[refStopIndex - 1]
      newStop.nextId = referenceStopId
      newStop.prevId = prevStop?.id || ''
      line.stops[refStopIndex].prevId = newStop.id
      if (prevStop) prevStop.nextId = newStop.id
    }

    // Insert the new stop at the correct position
    const insertIndex = position === 'after' ? refStopIndex + 1 : refStopIndex
    line.stops.splice(insertIndex, 0, newStop)

    Storage.save(this.lines)
    return true
  }

  /**
   * Deletes a stop from a transit line
   * @param lineId - ID of the line containing the stop
   * @param stopId - ID of the stop to delete
   * @returns true if stop was deleted successfully, false otherwise
   */
  deleteStop(lineId: string, stopId: string): boolean {
    const line = this.lines[lineId]
    if (!line) return false

    const stopIndex = line.stops.findIndex(stop => stop.id === stopId)
    if (stopIndex === -1) return false

    // Update links between adjacent stops
    const prevStop = line.stops[stopIndex - 1]
    const nextStop = line.stops[stopIndex + 1]
    if (prevStop) prevStop.nextId = nextStop?.id || ''
    if (nextStop) nextStop.prevId = prevStop?.id || ''

    // Remove the stop
    line.stops.splice(stopIndex, 1)

    Storage.save(this.lines)
    return true
  }
}

// Export a singleton instance
export const lineService = new LineService()