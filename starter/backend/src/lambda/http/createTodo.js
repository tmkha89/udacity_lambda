import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from '../utils.mjs';
import { createTodo } from '../../business/TodoBusiness.js';

// Initialize logger for HTTP processing
const logger = createLogger('http');

// Define the Lambda handler using Middy middleware
export const handler = middy()
  // Middleware for handling HTTP errors
  .use(httpErrorHandler())
  // Middleware for enabling CORS with credentials support
  .use(cors({
    credentials: true
  }))
  // Main handler function for the Lambda
  .handler(async (event) => {
    logger.info(`Processing createTodo event ${JSON.stringify(event, null, 2)}`);
    
    // Parse the incoming request body to get the new TODO item
    const todoItem = JSON.parse(event.body);

    // Extract the user ID from the event (e.g., from a JWT token)
    const userId = getUserId(event);

    // Call the business logic to create a new TODO item
    const item = await createTodo(todoItem, userId);

    logger.info(`Item created ${JSON.stringify(item, null, 2)}`);

    // Return a success response with the created item
    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    };
  });
