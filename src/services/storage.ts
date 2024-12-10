import fs from 'fs'
import path from 'path'
import { TransitLine } from 'src/types/line'
import { LINES } from 'src/constants/lines'

const STORAGE_PATH = path.join(__dirname, '../../data/lines.json')

export class Storage {
  static initialize(): void {
    const dir = path.dirname(STORAGE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(STORAGE_PATH)) {
      this.save(LINES)
    }
  }

  static save(lines: { [lineId: string]: TransitLine }): void {
    // Ensure directory exists
    const dir = path.dirname(STORAGE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(lines, null, 2))
  }

  static load(): { [lineId: string]: TransitLine } {
    try {
      if (fs.existsSync(STORAGE_PATH)) {
        const data = fs.readFileSync(STORAGE_PATH, 'utf8')
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    return LINES // Return default data if file doesn't exist or has errors
  }
}
