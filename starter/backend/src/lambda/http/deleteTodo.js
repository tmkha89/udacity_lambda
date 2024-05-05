import { getUserIdFromEvent } from '../utils.mjs'
import { deleteTodoItem } from '../../businessLogic/todo.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  console.log('todoId', todoId)
  const userId = getUserIdFromEvent(event)
  console.log('userId', userId)

  await deleteTodoItem(userId, todoId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
    },
    body: ''
  }
}
