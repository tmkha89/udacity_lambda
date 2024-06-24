// Import necessary modules and functions
import middy from "@middy/core"
import cors from '@middy/http-cors'
import httpErrorHandler from "@middy/http-error-handler"
import { createLogger } from '../../utils/logger.mjs'
import { updateTodo } from '../../business/TodoBusiness.js'
import { getUserId } from "../utils.mjs"

// Create a logger instance
const logger = createLogger('http')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true  // Allow credentials in CORS requests
  }))
  .handler(async (event) => {
    const updateRequest = JSON.parse(event.body);

    const todoId = event.pathParameters.todoId
    
    const userId = getUserId(event)

    logger.info(`Processing updateTodo ${JSON.stringify(updateRequest, null, 2)}, id: ${todoId}`)

    await updateTodo(userId, todoId, updateRequest);

    return {
      statusCode: 204,
    };
  });
