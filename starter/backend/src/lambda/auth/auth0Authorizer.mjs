import jsonwebtoken from 'jsonwebtoken';
import { createLogger } from '../../utils/logger.mjs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Initialize logger for the authentication process
const logger = createLogger('auth');

// Read the Auth0 signing certificate from the file system
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const certFile = path.join(__dirname, 'auth0.crt');
const pemCert = fs.readFileSync(certFile, 'utf8');
logger.info('Loaded Auth0 signing certificate', pemCert);

/**
 * Lambda function handler to authenticate and authorize API requests
 * @param {Object} event - The Lambda event object
 * @returns {Object} - The policy document allowing or denying access
 */
export async function handler(event) {
  try {
    // Verify the JWT token from the authorization header
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('User was authorized', jwtToken);

    // Return a policy document allowing the user to invoke API methods
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
    };
  } catch (e) {
    logger.error('User not authorized', { error: e.message });

    // Return a policy document denying the user access
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
    };
  }
}

/**
 * Verify the JWT token from the authorization header
 * @param {string} authHeader - The authorization header containing the JWT token
 * @returns {Object} - The decoded JWT token
 */
async function verifyToken(authHeader) {
  if (!authHeader) throw new Error('No authorization header');

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authorization header');
  }

  const token = getToken(authHeader);
  logger.info('Extracted token', { token, pemCert });

  // Verify the JWT token using the Auth0 signing certificate
  return jsonwebtoken.verify(token, pemCert, { algorithms: ['RS256'] });
}

/**
 * Extract the JWT token from the authorization header
 * @param {string} authHeader - The authorization header
 * @returns {string} - The extracted JWT token
 */
function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}