import { getUserIdFromEvent } from '../utils.mjs'
import { generateUploadUrl } from '../../businessLogic/todo.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

// export async function handler(event) {
//   const todoId = event.pathParameters.todoId
//   const userId = getUserIdFromEvent(event)
//   const uploadUrl = await generateUploadUrl(userId, todoId)

//   return {
//     statusCode: 201,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Credentials': true,
//       'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH',
//       'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
//     },
//     body: JSON.stringify({
//       uploadUrl: uploadUrl
//     })
//   }
// }

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
