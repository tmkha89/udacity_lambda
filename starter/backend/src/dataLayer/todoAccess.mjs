import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AttachmentUtils } from '../fileStorage/attchmentUtils.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const attachmentUtils = new AttachmentUtils()

export class ToDoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    toDoTable = process.env.TODOS_TABLE,
    toDoIndex = process.env.INDEX_NAME,
    bucketName = process.env.TODO_S3_BUCKET,
    s3Client = new S3Client()
  ) {
    this.documentClient = documentClient
    this.toDoTable = toDoTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.toDoIndex = toDoIndex
    this.bucketName = bucketName
    this.s3Client = s3Client
  }

  async createToDoItem(userId, todoId, bodyRequest) {
    console.log('userId', userId)
    console.log('todoId', todoId)
    // console.log('Create new to do item: ', bodyRequest)
    const timestamp = new Date().toISOString()

    // /console.log('bodyRequest parse - ', JSON.parse(bodyRequest))

    const newItem = {
      userId,
      todoId,
      timestamp,
      done: false,
      attachmentUrl: attachmentUtils.getAttachmentUrl(todoId),
      name: bodyRequest.name,
      dueDate: bodyRequest.dueDate
      //name: JSON.parse(bodyRequest).name,
      //dueDate: JSON.parse(bodyRequest).dueDate
    }
    console.log('new Item a', newItem)

    await this.dynamoDbClient.put({
      TableName: this.toDoTable,
      Item: newItem
    })

    console.log('new Item b')

    return newItem
  }

  async getAllToDosByUserId(userId) {
    console.log('Getting all to do items for user: ', userId)

    const result = await this.dynamoDbClient.query({
      TableName: this.toDoTable,
      IndexName: this.toDoIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })

    return result.Items
  }

  async deleteTodoItem(userId, todoId) {
    console.log('Deleting todo item: ', todoId)

    await this.dynamoDbClient.delete({
      TableName: this.toDoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
  }
  async updateTodoItem(userId, todoId, updatedTodo) {
    console.log('Updating todo item: ', todoId)
    console.log('Updated todo item: ', updatedTodo)
    console.log('userId', userId)

    await this.dynamoDbClient.update({
      TableName: this.toDoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    })

    console.log('Update successful')
  }
  async generateUploadUrl(userId, todoId) {
    console.log('userId', userId)
    console.log('todoId', todoId)
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const result = await this.dynamoDbClient.update({
      TableName: this.toDoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    })
    console.log('result', result)
  }
}
