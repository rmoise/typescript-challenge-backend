import { json } from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { transitLinesRouter } from './api/transit-lines'

export const app = express()

app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(json())

app.use('/transit-lines', transitLinesRouter)
