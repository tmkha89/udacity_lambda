import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl =
  'https://dev-f7omoxdquozauzab.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    console.log('jwtToken', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  console.log('token - ', token)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  console.log('start')

  const response = await Axios.get(jwksUrl)
  const keys = response.data.keys

  const signingKeys = keys.find((key) => key.kid === jwt.header.kid)
  logger.info('signingKeys', signingKeys)

  if (!signingKeys) {
    throw new Error('The JWKS endpoint did not contain any keys')
  }

  const pemData = signingKeys.x5c[0]

  const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`
  const verifiedToken = jsonwebtoken.verify(token, cert, {
    algorithms: ['RS256']
  })

  return verifiedToken
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
// import jsonwebtoken from 'jsonwebtoken'

// const certificate = `-----BEGIN CERTIFICATE-----
// MIIDHTCCAgWgAwIBAgIJIKT5h6xfaF3hMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
// BAMTIWRldi1mN29tb3hkcXVvemF1emFiLnVzLmF1dGgwLmNvbTAeFw0yNDA0Mjkw
// ODUyMThaFw0zODAxMDYwODUyMThaMCwxKjAoBgNVBAMTIWRldi1mN29tb3hkcXVv
// emF1emFiLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// ggEBAOvh3NK70fQgsi1o/HSPAc2kY+vUj64mE83htoMq5bW6k9VoOYQCDP9RUyo3
// I7ixFnXjOR5ZGxl0UWIUexglkBASd0RauIt3zZMpLA98KzJ3rExi5+ilrKmcsgrn
// RGVPEXkXMbyPd/E2Xy8S5C7KYJ+QU2GLllalBV6MpYqYNygM3hnFWWG1LhTngFDg
// UGcv+YJvNRxUPrmWtT4+3qPMGE5m0XIhGFqZYnYVH+cCJ2jaH1/yL3THyiM7kY7Y
// emc1R91W4rZWL1Yjm2npNwNpqxcnRxJZDbKDMAgHQKk91kgzyuAmcabKbEg1WQ4/
// EoSMXTb47Woa0V3kPDZRQh0RIBcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
// BgNVHQ4EFgQUZBD1QLKtEUKgqPKOa7+rbzdkAWAwDgYDVR0PAQH/BAQDAgKEMA0G
// CSqGSIb3DQEBCwUAA4IBAQC/oJGrXrFMInrQSypVTjeBY4SYCB6Ppmyf9j9a2HY5
// 7ybArbqpyTd6DT/tg+vCPBK3I2mZ7XayoS+ze+w8e3O4I80nKJQ7mrkontYEB2uz
// WyRAQjcztZHtUcVIztCWHBaze2Hui6YSJZIc4S/pWznPnpWVtT5As/ImiP6qeoWE
// 0hYcXb6f6zqXKxIsXoqFcHFvXo++Xjum43Dn+nMde8bKgskfVxfedUUINqb0vwuU
// 7zRN/mFznwNhxIEq2VEg65llYKFcDc2BW1QY4USlG0Gur2rdcIHwlIIJEiLhOu66
// jHfTgmTEb1FLWcXbX9F0k9NFW8wLOX+/tM7rRkX4vm3c
// -----END CERTIFICATE-----`

// export async function handler(event) {
//   try {
//     const jwtToken = verifyToken(event.authorizationToken)
//     console.log('User was authorized', jwtToken)

//     return {
//       principalId: jwtToken.sub,
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Allow',
//             Resource: '*'
//           }
//         ]
//       }
//     }
//   } catch (e) {
//     console.log('User was not authorized', e.message)

//     return {
//       principalId: 'user',
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Deny',
//             Resource: '*'
//           }
//         ]
//       }
//     }
//   }
// }

// function verifyToken(authHeader) {
//   if (!authHeader) throw new Error('No authorization header')

//   if (!authHeader.toLowerCase().startsWith('bearer '))
//     throw new Error('Invalid authorization header')

//   const split = authHeader.split(' ')
//   const token = split[1]
//   console.log('token - ', token)

//   return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
// }
