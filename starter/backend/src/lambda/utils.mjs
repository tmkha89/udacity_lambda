import { parseUserId } from '../auth/utils.mjs'

export function getUserIdFromEvent(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
