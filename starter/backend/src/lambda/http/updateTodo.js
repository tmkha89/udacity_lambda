// Import necessary modules and functions
import middy from "@middy/core"
import cors from '@middy/http-cors'
import httpErrorHandler from "@middy/http-error-handler"
import { createLogger } from '../../utils/logger.mjs'
import { updateTodo } from '../../business/TodoBusiness.js'
import { getUserId } from "../utils.mjs"

// Create a logger instance
const logger = createLogger('http')

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
    // Parse the update request from the request body
    const updateRequest = JSON.parse(event.body);

    // Extract todoId from the path parameters of the event
    const todoId = event.pathParameters.todoId
    
    // Get the userId using a utility function
    const userId = getUserId(event)

    // Log a message indicating the start of updateTodo processing
    logger.info(`Processing updateTodo ${JSON.stringify(updateRequest, null, 2)}, id: ${todoId}`)

    // Update the todo item with the userId, todoId, and updateRequest
    await updateTodo(userId, todoId, updateRequest);

    // Return a successful response with status code 204 (No Content)
    return {
      statusCode: 204,
    };
  });
