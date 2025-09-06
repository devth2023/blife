// ======================================================================
// APPLICATION CONFIGURATION
// ======================================================================
// This file contains the central configuration for the application.
// Use this to switch between different operational modes.

/**
 * Defines the data source for the entire application.
 * - 'LOCAL_STORAGE': (Default) The app runs in developer mode. All data is
 *   read from and written to the browser's local storage. This is ideal for
 *   UI development and testing without a backend.
 * - 'API': The app runs in production mode. The service layer (`services/api.ts`)
 *   will attempt to make real HTTP requests to a backend. You must implement
 *   the API endpoints for this to work.
 *
 * See README.md for instructions on how to connect your backend.
 */
export const DATA_SOURCE: 'LOCAL_STORAGE' | 'API' = 'LOCAL_STORAGE';
