import { getUserIdFromEvent } from '../utils.mjs'
import { updateTodoItem } from '../../businessLogic/todo.mjs'
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  console.log('todoId', todoId)
  console.log('event', event)

  const updatedTodo = event.body
  const userId = getUserIdFromEvent(event)

  await updateTodoItem(userId, todoId, updatedTodo)
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
