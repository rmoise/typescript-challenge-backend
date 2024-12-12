# Transit Lines API Backend

A TypeScript-based REST API for managing transit lines and stops. This backend service provides endpoints for creating, reading, updating, and deleting transit lines and their associated stops.

## Features

- 🚇 Full CRUD operations for transit lines and stops
- 🔍 Filtering capabilities for stops based on various metrics
- 📊 Population reachability metrics for stops
- 💾 Persistent storage with file-based JSON database
- 🔒 Input validation and error handling
- 📝 Comprehensive API documentation
- ✨ Clean, type-safe TypeScript implementation

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier
- **Documentation**: JSDoc

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm >= 7.0.0

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/typescript-challenge-backend.git
   cd typescript-challenge-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run tests:
   ```bash
   npm test
   ```

## API Documentation

### Transit Lines

#### Get All Lines
- **GET** `/transit-lines`
- Returns all transit lines in the system
- Response: Array of TransitLine objects
- Status Codes: 200 (Success)

#### Get Specific Line
- **GET** `/transit-lines/:lineId`
- Returns details of a specific transit line
- Response: TransitLine object
- Status Codes: 200 (Success), 400 (Not Found)

#### Create New Line
- **POST** `/transit-lines/:lineId`
- Creates a new transit line
- Body: `{ stops: TransitStop[] }`
- Requirements:
  - At least 2 stops required
  - Line ID must be unique
- Status Codes: 201 (Created), 400 (Invalid Request)

#### Delete Line
- **DELETE** `/transit-lines/:lineId`
- Removes a transit line and all its stops
- Status Codes: 200 (Success), 400 (Not Found)

### Stops

#### Get All Stops
- **GET** `/transit-lines/stops`
- Returns all stops across all lines
- Query Parameters:
  - `peopleOn`: Filter by minimum number of boarding passengers
  - `peopleOff`: Filter by minimum number of alighting passengers
  - `reachablePopulationWalk`: Filter by minimum walking-distance population
  - `reachablePopulationBike`: Filter by minimum biking-distance population
- Response: Array of TransitStop objects
- Status Codes: 200 (Success)

#### Add Stop
- **POST** `/transit-lines/:lineId/stops/:referenceId`
- Adds a new stop to a line
- Body:
  ```typescript
  {
    stop: TransitStop,
    position: 'before' | 'after'
  }
  ```
- Status Codes: 200 (Success), 400 (Invalid Request)

#### Update Stop
- **PUT** `/transit-lines/:lineId/stops/:stopId`
- Updates stop properties
- Body: Partial<TransitStop> (excluding id, prevId, nextId)
- Status Codes: 200 (Success), 400 (Invalid Request)

#### Delete Stop
- **DELETE** `/transit-lines/:lineId/stops/:stopId`
- Removes a stop from a line
- Status Codes: 200 (Success), 400 (Invalid Request)

## Data Models

### TransitLine
```typescript
interface TransitLine {
  id: string;
  stops: TransitStop[];
}
```

### TransitStop
```typescript
interface TransitStop {
  name: string;
  id: string;
  lat: number;
  lng: number;
  prevId: string;
  nextId: string;
  peopleOn: number;
  peopleOff: number;
  reachablePopulationWalk: number;
  reachablePopulationBike: number;
}
```

## Architecture

The application follows a clean architecture pattern:
- `api/`: HTTP controllers and route definitions
- `services/`: Business logic and data manipulation
- `types/`: TypeScript interfaces and type definitions
- `config/`: Application configuration

## Error Handling

The API provides meaningful error messages and appropriate HTTP status codes:
- 200: Successful operation
- 201: Resource created successfully
- 400: Invalid request or resource not found
- 500: Server error

## Testing

The project includes comprehensive test coverage:
```bash
npm test                 # Run all tests
npm test -- --coverage  # Run tests with coverage report
```

## Development

### Code Style
The project uses ESLint and Prettier for consistent code style:
```bash
npm run lint       # Check code style
npm run lint:fix   # Fix code style issues
```

### Type Checking
```bash
npm run lint      # Includes TypeScript type checking
```

## Future Improvements

Potential areas for enhancement:
- Add authentication and authorization
- Implement rate limiting
- Add database support (e.g., PostgreSQL)
- Add OpenAPI/Swagger documentation
- Add more advanced filtering and sorting options
- Implement caching
- Add real-time updates via WebSocket

## Contributing

While this is a challenge project, I welcome feedback and suggestions for improvement.

## License

This project is part of a technical challenge and is available for review purposes.
