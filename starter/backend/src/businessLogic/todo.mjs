import * as uuid from 'uuid'
import { ToDoAccess } from '../dataLayer/todoAccess.mjs'
import { AttachmentUtils } from '../fileStorage/attchmentUtils.mjs'
const toDoAccess = new ToDoAccess()
const attachmentUrl = new AttachmentUtils()

export async function getAllToDosByUserId(userId) {
  return toDoAccess.getAllToDosByUserId(userId)
}

export async function createToDoItem(userId, bodyRequest) {
  console.log('body in business', bodyRequest)
  const itemId = uuid.v4()

  return await toDoAccess.createToDoItem(userId, itemId, bodyRequest)
}

export async function deleteTodoItem(userId, todoId) {
  return toDoAccess.deleteTodoItem(userId, todoId)
}

export async function updateTodoItem(userId, todoId, updatedTodo) {
  return toDoAccess.updateTodoItem(userId, todoId, updatedTodo)
}

export async function generateUploadUrl(userId, todoId) {
  toDoAccess.generateUploadUrl(userId, todoId)
  const url = await attachmentUrl.getUploadUrl(todoId)

  console.log('attachmentUrl', url)

  return url
}
