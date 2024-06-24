import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('dataLayer');

// Initialize DynamoDB Document Client
const documentClient = AWSXRay.captureAWSv3Client(new DynamoDB());
const dynamoDbClient = DynamoDBDocument.from(documentClient);
const todosTable = process.env.TODOS_TABLE;

/**
 * Get all TODOs by userId
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - A promise that resolves to an array of TODOs
 */
export async function getTodosByUserId(userId, pageSize, nextPageKey) {
  logger.info(`Getting all TODOs for user ${userId}, pageSize: ${pageSize}, page ${nextPageKey}`);

  let params = {
    TableName: this.todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ProjectionExpression: 'todoId, userId, attachmentUrl, dueDate, createdAt, name, done',
  };

  // Conditionally add pagination parameters if provided
  if (pageSize) {
    params.Limit = pageSize;
  }
  if (nextPageKey) {
    params.ExclusiveStartKey = nextPageKey;
  }

  logger.info(`Getting all TODOs for user, params:`, params);

  try {
    const result = await this.dynamoDbClient.query(params).promise();
    logger.info('Get Todos successfully', result);

    const items = result.Items.map(item => ({
      todoId: item.todoId,
      userId: item.userId,
      attachmentUrl: item.attachmentUrl,
      dueDate: item.dueDate,
      createdAt: item.createdAt,
      name: item.name,
      done: item.done
    }));

    return {
      items,
      nextPageKey: result.LastEvaluatedKey // undefined if no more pages
    };
  } catch (error) {
    logger.error(`Error fetching TODOs for user ${userId}`, error);
    throw error;
  }
}

/**
 * Create a new TODO
 * @param {Object} createTodoRequest - The request object containing todo details
 * @returns {Promise<Object>} - A promise that resolves to the created TODO item
 */
export async function createNewTodoItem(createTodoRequest) {
  logger.info(`Creating a TODO with id ${createTodoRequest.todoId} ${JSON.stringify(createTodoRequest, null, 2)}`);

  await dynamoDbClient.put({
    TableName: todosTable,
    Item: createTodoRequest,
  });

  return { ...createTodoRequest };
}

/**
 * Update an existing TODO
 * @param {string} userId - The ID of the user
 * @param {string} todoId - The ID of the TODO to be updated
 * @param {Object} updateTodoRequest - The request object containing updated todo details
 * @returns {Promise<void>} - A promise that resolves when the TODO is updated
 */
export async function updateExistingTodoItem(userId, todoId, updateTodoRequest = {}) {
  logger.info(`Updating ${todoId} with ${JSON.stringify(updateTodoRequest, null, 2)}`);
  const { name, dueDate, done } = updateTodoRequest;

  const params = {
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':dueDate': dueDate,
      ':done': done,
    },
    ReturnValues: 'UPDATED_NEW'
  };

  await dynamoDbClient.update(params);
}

/**
 * Set an attachment URL for a TODO
 * @param {string} userId - The ID of the user
 * @param {string} todoId - The ID of the TODO
 * @param {string} image - The image file associated with the TODO
 * @param {string} attachmentUrl - The URL of the attachment
 * @returns {Promise<void>} - A promise that resolves when the attachment URL is set
 */
export async function updateExistsTodoAttachmentUrl(userId, todoId, image, attachmentUrl) {
  logger.info(`Setting attachmentUrl for ${todoId} ${attachmentUrl}`);
  
  const params = {
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set image = :image, attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl,
      ':image': image,
    },
    ReturnValues: 'UPDATED_NEW'
  };

  await dynamoDbClient.update(params);
}

/**
 * Delete a TODO item
 * @param {string} userId - The ID of the user
 * @param {string} todoId - The ID of the TODO to be deleted
 * @returns {Promise<void>} - A promise that resolves when the TODO is deleted
 */
export async function deleteTodoItem(userId, todoId) {
  logger.info(`Removing TODO: ${todoId} for user: ${userId}`);
  
  await dynamoDbClient.delete({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    }
  });
}