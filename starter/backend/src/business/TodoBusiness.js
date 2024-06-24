import { createLogger } from '../utils/logger.mjs';
import { v4 as uuid } from 'uuid';
import {
  getTodosByUserId,
  createNewTodoItem,
  deleteTodoItem,
  updateExistingTodoItem,
  updateExistsTodoAttachmentUrl
} from "../dataLayer/TodosAccess.js";

// Create a logger instance for logging business logic events
const logger = createLogger('businessLogic');

// Retrieve todos by userId
export async function getByUserId(userId) {
  logger.info(`getByUserId ${userId}`);
  return getTodosByUserId(userId);
}

// Create a new todo item
export async function createTodo(todoItem, userId) {
  const todoId = uuid(); // Generate a new UUID for the todoId
  logger.info(`createTodo ${userId} todoId ${todoId}`);

  // Construct the todo item and persist it
  return await createNewTodoItem({
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...todoItem
  });
}

// Update an existing todo item
export async function updateTodo(userId, todoId, updateTodoRequest) {
  logger.info(`updateTodo ${userId} todoId ${todoId} request ${JSON.stringify(updateTodoRequest, null, 2)}`);

  // Update the todo item with the provided request
  return await updateExistingTodoItem(userId, todoId, { ...updateTodoRequest });
}

// Update the attachment URL of a todo item
export async function updateTodoAttachmentUrl(userId, todoId, image, attachmentUrl) {
  logger.info(`updateTodoAttachmentUrl ${userId} todoId ${todoId} attachmentUrl ${attachmentUrl}`);

  // Update the attachment URL of the todo item
  return await updateExistsTodoAttachmentUrl(userId, todoId, image, attachmentUrl);
}

// Generate a signed URL for uploading an attachment to S3
export async function generateAttachmentSignUrl(todoId) {
  // Create a command to put an object in S3
  const command = new PutObjectCommand({
    Bucket: process.env.IMAGES_S3_BUCKET, // S3 bucket name from environment variables
    Key: todoId  // Key is the todoId
  });

  logger.info(`generateAttachmentSignUrl`);

  // Generate a signed URL with an expiration
  return await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  });
}

// Delete a todo item
export async function deleteTodo(userId, todoId) {
  logger.info(`deleteTodo ${userId} todoId ${todoId}`);

  // Delete the todo item with the provided userId and todoId
  return await deleteTodoItem(userId, todoId);
}
