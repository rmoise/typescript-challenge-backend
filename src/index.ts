import { app } from './app'
import { EXPRESS_PORT } from './config'
import { Storage } from './services/storage'

const SERVICE_NAME = 'Transit Lines API'

console.log(`Starting ${SERVICE_NAME}`)

// Initialize storage with default data if needed
Storage.initialize()

app.listen(EXPRESS_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${EXPRESS_PORT}`)
})
