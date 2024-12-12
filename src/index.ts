/**
 * Application entry point
 * @module index
 *
 * This is the main entry point for the Transit Lines API service.
 * It initializes the storage system and starts the Express server.
 */

import { app } from './app'
import { EXPRESS_PORT } from './config'
import { Storage } from './services/storage'

// Service configuration
const SERVICE_NAME = 'Transit Lines API'

// Startup logging
console.log(`Starting ${SERVICE_NAME}`)

// Initialize storage system with default data if needed
Storage.initialize()

// Start the Express server
app.listen(EXPRESS_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${EXPRESS_PORT}`)
})
