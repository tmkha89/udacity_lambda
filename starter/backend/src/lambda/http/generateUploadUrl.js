import { getUserIdFromEvent } from '../utils.mjs'
import { generateUploadUrl } from '../../businessLogic/todo.mjs'
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
    const userId = getUserIdFromEvent(event)
    const uploadUrl = await generateUploadUrl(userId, todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
