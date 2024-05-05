import { getUserIdFromEvent } from '../utils.mjs'
import { updateTodoItem } from '../../businessLogic/todo.mjs'
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
    console.log('event', event)

    const updatedTodo = event.body
    const userId = getUserIdFromEvent(event)

    await updateTodoItem(userId, todoId, updatedTodo)
    return {
      statusCode: 200,
      body: ''
    }
  })
