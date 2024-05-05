import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { getAllToDosByUserId } from '../../businessLogic/todo.mjs'
import { getUserIdFromEvent } from '../utils.mjs'

export async function handler(event) {
  const userId = getUserIdFromEvent(event)
  console.log('userId', userId)
  const toDos = await getAllToDosByUserId(userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
    },
    body: JSON.stringify({
      item: toDos
    })
  }
}
