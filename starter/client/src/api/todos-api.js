import Axios from 'axios'

export async function getTodos(idToken) {
  console.log('Fetching todos')

  console.log('Token:', idToken)

  const response = await Axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )

  console.log('Todos:', response.data.item)
  return response.data.item
}

export async function createTodo(idToken, newTodo) {
  console.log('start in BE')
  console.log('Token:', idToken)
  console.log('newTodo:', JSON.stringify(newTodo))
  let headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  headers.append('Origin', 'http://localhost:3000')
  headers.append('Authorization', `Bearer ${idToken}`)

  // const response = await Axios.post(
  //   `${process.env.REACT_APP_API_ENDPOINT}/todos`,
  //   JSON.stringify(newTodo),
  //   { mode: 'cors', credentials: 'include', headers: headers }
  //   // headers: {
  //   //   'Content-Type': 'application/json',
  //   //   Authorization: `Bearer ${idToken}`
  //   // }
  // )
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
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
    `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`,
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
  await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(idToken, todoId) {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}/attachment`,
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
