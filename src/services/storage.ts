/**
 * Storage service for managing transit line data persistence
 * @module services/storage
 *
 * This service handles the file-based storage operations for transit line data.
 * It provides methods to initialize storage, save data, and load data from disk.
 */

import fs from 'fs'
import path from 'path'
import { TransitLine } from 'src/types/line'
import { LINES } from 'src/constants/lines'

// Path to the JSON file where transit line data is stored
const STORAGE_PATH = path.join(__dirname, '../../data/lines.json')

/**
 * Static class for handling file-based storage operations
 */
export class Storage {
  /**
   * Initializes the storage system
   * Creates necessary directories and default data file if they don't exist
   * @throws {Error} If directory creation or file writing fails
   */
  static initialize(): void {
    const dir = path.dirname(STORAGE_PATH)
    try {
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      // Create default data file if it doesn't exist
      if (!fs.existsSync(STORAGE_PATH)) {
        this.save(LINES)
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error)
      throw error
    }
  }

  /**
   * Saves transit line data to storage
   * @param lines Object containing transit line data to save
   * @throws {Error} If saving to file fails
   */
  static save(lines: { [lineId: string]: TransitLine }): void {
    try {
      // Ensure data directory exists
      const dir = path.dirname(STORAGE_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      // Write data to file with pretty formatting for readability
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(lines, null, 2))
    } catch (error) {
      console.error('Failed to save data:', error)
      throw error
    }
  }

  /**
   * Loads transit line data from storage
   * @returns Object containing transit line data, or default data if file doesn't exist
   * @throws {Error} If reading from file fails
   */
  static load(): { [lineId: string]: TransitLine } {
    try {
      if (fs.existsSync(STORAGE_PATH)) {
        const data = fs.readFileSync(STORAGE_PATH, 'utf8')
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      throw error
    }
    return LINES // Fallback to default data if file is missing or corrupted
  }
}
