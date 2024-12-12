import { app } from 'src/app'
import { agent } from 'supertest'
import { lineService } from 'src/services/lineService'
import { LINES } from 'src/constants/lines'
import { Storage } from 'src/services/storage'

// Reset the lines data before each test
beforeEach(() => {
  // Reset the lines to their initial state and save to storage
  const initialLines = JSON.parse(JSON.stringify(LINES))
  Storage.save(initialLines)
  lineService['lines'] = initialLines
})

describe('Get line controller', () => {
  test('get a valid line', async () => {
    const response = await agent(app).get('/transit-lines/u9')

    expect(response.status).toBe(200)
    expect(response.body.id).toBe('u9')
    expect(response.body.stops.length).toBe(19)
  })

  test('get an error if line does not exist', async () => {
    const response = await agent(app).get('/transit-lines/u8')

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Not found')
  })
})

describe('Delete stop controller', () => {
  test('delete a valid stop', async () => {
    const response = await agent(app).delete('/transit-lines/u9/stops/94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Stop deleted successfully')

    // Verify stop was actually deleted
    const lineResponse = await agent(app).get('/transit-lines/u9')
    expect(lineResponse.body.stops.find((s) => s.id === '94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3')).toBeUndefined()
  })

  test('fail to delete when line does not exist', async () => {
    const response = await agent(app).delete('/transit-lines/u8/stops/some-id')

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not delete stop')
  })

  test('fail to delete when stop does not exist', async () => {
    const response = await agent(app).delete('/transit-lines/u9/stops/non-existent-stop')

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not delete stop')
  })
})

describe('Add stop controller', () => {
  test('add a valid stop after reference', async () => {
    const newStop = {
      name: 'New Test Stop',
      id: 'test-stop-id',
      lat: 52.5,
      lng: 13.3,
      prevId: '',
      nextId: '',
      peopleOn: 0,
      peopleOff: 0,
      reachablePopulationWalk: 1000,
      reachablePopulationBike: 5000
    }

    // Using a different reference stop (U Leopoldplatz)
    const response = await agent(app)
      .post('/transit-lines/u9/stops/ed286c0f-4887-417c-a112-7f0c92ce02a6')
      .send({ stop: newStop, position: 'after' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Stop added successfully')

    // Verify stop was actually added
    const lineResponse = await agent(app).get('/transit-lines/u9')
    const addedStop = lineResponse.body.stops.find(s => s.id === 'test-stop-id')
    expect(addedStop).toBeDefined()
    expect(addedStop.name).toBe('New Test Stop')
  })

  test('fail to add when line does not exist', async () => {
    const response = await agent(app).post('/transit-lines/u8/stops/some-id').send({ stop: {}, position: 'after' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not add stop')
  })

  test('fail to add when reference stop does not exist', async () => {
    const response = await agent(app).post('/transit-lines/u9/stops/non-existent-stop').send({ stop: {}, position: 'after' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not add stop')
  })
})

describe('Edit stop controller', () => {
  test('edit a valid stop', async () => {
    const updates = {
      name: 'Updated Stop Name',
      lat: 52.5,
      lng: 13.4,
      peopleOn: 25,
      peopleOff: 10,
      reachablePopulationWalk: 1000,
      reachablePopulationBike: 5000
    }

    const response = await agent(app)
      .put('/transit-lines/u9/stops/94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3')
      .send(updates)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Stop updated successfully')

    // Verify stop was actually updated
    const lineResponse = await agent(app).get('/transit-lines/u9')
    const updatedStop = lineResponse.body.stops.find(s => s.id === '94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3')
    expect(updatedStop).toBeDefined()
    expect(updatedStop.name).toBe('Updated Stop Name')
    expect(updatedStop.lat).toBe(52.5)
    expect(updatedStop.lng).toBe(13.4)
    expect(updatedStop.peopleOn).toBe(25)
  })

  test('fail to edit when line does not exist', async () => {
    const response = await agent(app)
      .put('/transit-lines/u8/stops/some-id')
      .send({ name: 'New Name' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not update stop')
  })

  test('fail to edit when stop does not exist', async () => {
    const response = await agent(app)
      .put('/transit-lines/u9/stops/non-existent-stop')
      .send({ name: 'New Name' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not update stop')
  })

  test('cannot edit critical fields', async () => {
    const updates = {
      id: 'new-id',
      prevId: 'new-prev',
      nextId: 'new-next'
    }

    const stopId = '94ff93c4-bcd5-44b2-9630-b92fb1dcdfc3'
    const originalStop = lineService.getLine('u9').stops.find(s => s.id === stopId)

    const response = await agent(app)
      .put('/transit-lines/u9/stops/' + stopId)
      .send(updates)

    expect(response.status).toBe(200)

    // Verify critical fields were not changed
    const lineResponse = await agent(app).get('/transit-lines/u9')
    const updatedStop = lineResponse.body.stops.find(s => s.id === stopId)
    expect(updatedStop.id).toBe(originalStop.id)
    expect(updatedStop.prevId).toBe(originalStop.prevId)
    expect(updatedStop.nextId).toBe(originalStop.nextId)
  })
})

describe('Add line controller', () => {
  test('add a valid line', async () => {
    const newLine = {
      stops: [
        {
          name: 'First Stop',
          id: 'first-stop',
          lat: 52.5,
          lng: 13.4,
          prevId: null,
          nextId: 'second-stop',
          peopleOn: 0,
          peopleOff: 0,
          reachablePopulationWalk: 1000,
          reachablePopulationBike: 5000
        },
        {
          name: 'Second Stop',
          id: 'second-stop',
          lat: 52.6,
          lng: 13.5,
          prevId: 'first-stop',
          nextId: null,
          peopleOn: 0,
          peopleOff: 0,
          reachablePopulationWalk: 2000,
          reachablePopulationBike: 6000
        }
      ]
    }

    const response = await agent(app)
      .post('/transit-lines/u10')
      .send(newLine)

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Line added successfully')

    // Verify line was actually added
    const lineResponse = await agent(app).get('/transit-lines/u10')
    expect(lineResponse.status).toBe(200)
    expect(lineResponse.body.id).toBe('u10')
    expect(lineResponse.body.stops.length).toBe(2)
    expect(lineResponse.body.stops[0].name).toBe('First Stop')
  })

  test('fail to add line with existing ID', async () => {
    const response = await agent(app)
      .post('/transit-lines/u9')
      .send({ stops: [] })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not create line. Line ID might already exist.')
  })

  test('fail to add line with less than 2 stops', async () => {
    const response = await agent(app)
      .post('/transit-lines/u10')
      .send({ stops: [{ name: 'Single Stop' }] })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not create line. At least 2 stops are required.')
  })
})

describe('Get all stops controller', () => {
  test('get all stops without filter', async () => {
    const response = await agent(app).get('/transit-lines/stops')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('get stops with peopleOn filter', async () => {
    const response = await agent(app).get('/transit-lines/stops?peopleOn=20')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    response.body.forEach(stop => {
      expect(stop.peopleOn).toBeGreaterThanOrEqual(20)
    })
  })

  test('get stops with multiple filters', async () => {
    const response = await agent(app).get('/transit-lines/stops?peopleOn=10&reachablePopulationWalk=5000')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    response.body.forEach(stop => {
      expect(stop.peopleOn).toBeGreaterThanOrEqual(10)
      expect(stop.reachablePopulationWalk).toBeGreaterThanOrEqual(5000)
    })
  })
})

describe('Get all lines controller', () => {
  test('get all lines successfully', async () => {
    const response = await agent(app).get('/transit-lines')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)

    // Check that each line has the required properties
    response.body.forEach(line => {
      expect(line).toHaveProperty('id')
      expect(line).toHaveProperty('stops')
      expect(Array.isArray(line.stops)).toBe(true)
    })
  })

  test('lines contain valid stops', async () => {
    const response = await agent(app).get('/transit-lines')

    expect(response.status).toBe(200)
    response.body.forEach(line => {
      line.stops.forEach(stop => {
        expect(stop).toHaveProperty('name')
        expect(stop).toHaveProperty('id')
        expect(stop).toHaveProperty('lat')
        expect(stop).toHaveProperty('lng')
        expect(stop).toHaveProperty('peopleOn')
        expect(stop).toHaveProperty('peopleOff')
        expect(stop).toHaveProperty('reachablePopulationWalk')
        expect(stop).toHaveProperty('reachablePopulationBike')
      })
    })
  })
})

describe('Delete line controller', () => {
  test('delete a valid line', async () => {
    const response = await agent(app).delete('/transit-lines/u9')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Line deleted successfully')

    // Verify line was actually deleted
    const lineResponse = await agent(app).get('/transit-lines/u9')
    expect(lineResponse.status).toBe(400)
    expect(lineResponse.body.error).toBe('Not found')
  })

  test('fail to delete non-existent line', async () => {
    const response = await agent(app).delete('/transit-lines/non-existent')

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Could not delete line. Line might not exist.')
  })
})
