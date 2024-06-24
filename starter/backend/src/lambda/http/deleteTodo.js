// Import necessary modules and functions
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { deleteTodo } from '../../business/TodoBusiness.js'
import { getUserId } from "../utils.mjs";

// Create a logger instance
const logger = createLogger('http')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true 
  }))
  .handler(async (event) => {
    
    // Extract todoId from the path parameters of the event
    const todoId = event.pathParameters.todoId
    
    logger.info(`Processing deleteTodo ${todoId}`)
    // Get the userId using a utility function
    const userId = getUserId(event)

    // Call a business function (deleteTodo) to delete the todo item for the userId
    await deleteTodo(userId, todoId)

    // Return a successful response
    return {
      statusCode: 200,
      body: {
        message: 'Delete successfully'
      }
    }
  })
