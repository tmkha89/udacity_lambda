// Import necessary modules and functions
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getByUserId } from '../../business/TodoBusiness.js'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

// Create a logger instance for logging 'Get All' events
const logger = createLogger('Get All')

// Define the main handler function using Middy middleware
export const handler = middy()
  // Use middleware for handling HTTP errors
  .use(httpErrorHandler())
  // Use middleware for CORS (Cross-Origin Resource Sharing) configuration
  .use(cors({
    credentials: true  // Allow credentials in CORS requests
  }))
  // Define the main handler function that processes the event
  .handler(async (event) => {

    // Log a message indicating the start of processing for getTodos event
    logger.info(`Processing getTodos event ${JSON.stringify(event, null, 2)}`)
    
    // Get Request Body
    const eventRequest = JSON.parse(event.body);

    // Get pagination info
    let pageSize = event.parameters && event.parameters['pageSize'] ? event.parameters['pageSize'] : null;
    let nextPageKey = event.parameters && event.parameters['nextPageKey'] ? event.parameters['nextPageKey'] : null;
    
    // Get the userId using a utility function
    const userId = getUserId(event)
    // Retrieve items associated with the userId from business logic
    const items = await getByUserId(userId, pageSize, nextPageKey)

    // Return a successful response with status code 200 and items in the body
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: items.items
      })
    }
  })
