import Axios from 'axios'
import { SERVERLESS_ENDPOINT } from '../config'

const apiEnpoint = SERVERLESS_ENDPOINT

export async function getTodos(idToken, limit, nextPageKey) {
  console.log('Fetching todos')

  const response = await Axios.get(
    `${apiEnpoint}/todos`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )

  return response.data.items
}

export async function createTodo(idToken, newTodo) {
  const response = await Axios.post(
    `${apiEnpoint}/todos`,
    JSON.stringify(newTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchTodo(idToken, todoId, updatedTodo) {
  await Axios.patch(
    `${apiEnpoint}/todos/${todoId}`,
    JSON.stringify(updatedTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteTodo(idToken, todoId) {
  await Axios.delete(`${apiEnpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(idToken, todoId) {
  const response = await Axios.post(
    `${apiEnpoint}/todos/${todoId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await Axios.put(uploadUrl, file)
}
