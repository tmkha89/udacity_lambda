import DynamoDBSDK from 'aws-sdk';
import { createLogger } from '../utils/logger.mjs';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

const dynamoDb = new DynamoDBSDK.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE || 'TodosTable';

const logger = createLogger('Todo Datalayer', tableName)

export const createTodo = async (todo) => {
  logger.info("Data Start Creating Todo", JSON.stringify(todo));

  const timestamp = new Date().toISOString();
  const params = {
    TableName: tableName,
    Item: {
      ...todo,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  logger.info('createNewTodo params', params)

  try {
    await dynamoDb.put(params).promise();
    return params.Item;
  } catch (error) {
    logger.error('Error creating todo:', error);
    throw new Error('Error creating todo');
  }
};

export const getAllTodosByUserId = async (userId, pageSize, nextPageKey) => {
  logger.info(`Getting all TODOs for user ${userId}, pageSize: ${pageSize}, page ${nextPageKey - 1}`);

  let params = {
    TableName: this.todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ProjectionExpression: 'todoId, userId, attachmentUrl, dueDate, createdAt, name, done', // Specify the attributes to return
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
};

export const updateTodoData = async (userId, todoId, updates) => {
  const timestamp = new Date().toString();
  const params = {
    TableName: tableName,
    Key: {
        userId: userId,
        todoId: todoId,
    },
    ExpressionAttributeNames: { '#todo_text': 'text' },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':duedate': update.duedate,
      ':done': updates.done,
      ':updateAt': timestamp
    },
    UpdateExpression: 'SET #name = :name, done = :done, duedate = :duedate, updateAt = :updateAt',
    ReturnValues: 'ALL_NEW',
  };

  try {
    logger.info('Start updating todo:', params);
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    logger.error('Error updating todo:', error);
    throw new Error('Error updating todo');
  }
};

export const deleteTodo = async (userId, todoId) => {
  logger.info("Data Start Deleting Todo" + `tableName: ${tableName}, userId: ${userId}, todoId: ${todoId}`);
  const params = {
    TableName: tableName,
    Key: {
      todoId,
      userId
    },
  };

  try {
    logger.info('items found', await this.dynamoDbClient.query(params).promise());

    // await dynamoDb.delete(params, () => {}).promise();
    return { success: true };
  } catch (error) {
    logger.error("Error deleting todo");
    throw new Error('Error deleting todo');
  }
};

export const updateAttachmentUrl = async (userId, todoId, image, uploadUrl) => {
  const params = {
    TableName: this.todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set image = :image, uploadUrl = :uploadUrl',
    ExpressionAttributeValues: {
      ':uploadUrl': uploadUrl,
      ':image': image,
    },
    ReturnValues: 'UPDATED_NEW'
  };

  logger.info(`Update image url for ${todoId} ${uploadUrl}`, params)

  try{
    await this.dynamoDbClient.update(params);

    return { success: true, uploadUrl };
  } catch (error) {
    logger.error("Error update attachment", JSON.stringify(error));
    throw new Error('Error update attachment');
  }
}