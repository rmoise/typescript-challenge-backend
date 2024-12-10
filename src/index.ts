import { app } from './app'
import { EXPRESS_PORT } from './config'

const SERVICE_NAME = 'Transit Lines API'

console.log(`Starting ${SERVICE_NAME}`)

app.listen(EXPRESS_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${EXPRESS_PORT}`)
})
