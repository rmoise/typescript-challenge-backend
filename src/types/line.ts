/**
 * Type definitions for transit system entities
 * @module types/line
 *
 * This module contains the core type definitions for the transit system,
 * including transit stops and lines.
 */

/**
 * Represents a single transit stop in the system
 * @interface TransitStop
 */
export interface TransitStop {
  /** Display name of the stop */
  name: string

  /** Unique identifier for the stop */
  id: string

  /** Latitude coordinate of the stop location */
  lat: number

  /** Longitude coordinate of the stop location */
  lng: number

  /** ID of the previous stop in the line (empty if first stop) */
  prevId: string

  /** ID of the next stop in the line (empty if last stop) */
  nextId: string

  /** Average number of people boarding at this stop */
  peopleOn: number

  /** Average number of people alighting at this stop */
  peopleOff: number

  /** Population reachable within walking distance */
  reachablePopulationWalk: number

  /** Population reachable within biking distance */
  reachablePopulationBike: number
}

/**
 * Represents a transit line containing multiple stops
 * @interface TransitLine
 */
export interface TransitLine {
  /** Unique identifier for the line */
  id: string

  /** Ordered array of stops that make up this line */
  stops: TransitStop[]
}
