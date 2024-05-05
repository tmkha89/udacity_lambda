import { getUserIdFromEvent } from '../utils.mjs'
import { deleteTodoItem } from '../../businessLogic/todo.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    console.log('todoId', todoId)
    const userId = getUserIdFromEvent(event)
    console.log('userId', userId)

    await deleteTodoItem(userId, todoId)

    return {
      statusCode: 200,
      body: ''
    }
  })
