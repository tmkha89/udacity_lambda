import { getUserIdFromEvent } from '../utils.mjs'
import { createToDoItem } from '../../businessLogic/todo.mjs'
import { AttachmentUtils } from '../../fileStorage/attchmentUtils.mjs'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

// export async function handler(event) {
//   const attachmentUtils = new AttachmentUtils()
//   //handle Auth
//   console.log('event', event)

//   const parsedBody = event.body
//   console.log('parse', parsedBody)
//   //const authorization = event.headers.Authorization
//   //get userId
//   const userId = getUserIdFromEvent(event)
//   console.log('userId', userId)
//   //create new ToDo: userId, todoId, event
//   const newToDo = await createToDoItem(userId, parsedBody)
//   console.log('newToDo', newToDo)
//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//       // 'Access-Control-Allow-Credentials': true,
//       // 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH',
//       // 'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
//     },
//     body: JSON.stringify({
//       item: newToDo
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
    const attachmentUtils = new AttachmentUtils()
    //handle Auth
    console.log('event', event)

    const parsedBody = event.body
    console.log('parse', parsedBody)
    //const authorization = event.headers.Authorization
    //get userId
    const userId = getUserIdFromEvent(event)
    console.log('userId', userId)
    //create new ToDo: userId, todoId, event
    const newToDo = await createToDoItem(userId, parsedBody)
    console.log('newToDo', newToDo)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: newToDo
      })
    }
  })
