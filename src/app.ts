/**
 * Main application setup and configuration
 * @module app
 *
 * This file sets up the Express application with necessary middleware
 * and route configurations. It handles CORS, request parsing, and logging.
 */

import { json } from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { transitLinesRouter } from './api/transit-lines'

// Initialize Express application
export const app = express()

// Configure middleware
app.use(morgan('dev'))  // HTTP request logger for debugging and monitoring

// Configure CORS for cross-origin requests
app.use(cors({
  origin: '*',  // Allow all origins (customize in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allowed request headers
}))

// Parse JSON request bodies
app.use(json())

// Register route handlers
app.use('/transit-lines', transitLinesRouter)  // Mount transit lines routes under /transit-lines path
