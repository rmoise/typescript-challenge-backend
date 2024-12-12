/**
 * Application configuration
 * @module config
 *
 * This module contains all configuration values for the application.
 * Values can be overridden using environment variables.
 */

/**
 * Port number for the Express server
 * Can be overridden using the PORT environment variable
 * @default 9000
 */
export const EXPRESS_PORT = process.env.PORT || 9000
