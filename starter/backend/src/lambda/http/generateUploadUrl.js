import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createLogger } from '../../utils/logger.mjs';
import { updateTodoAttachmentUrl, generateAttachmentSignUrl } from '../../business/TodoBusiness.js';
import { getUserId } from "../utils.mjs";

const loggerInstance = createLogger('httpHandler');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (lambdaEvent) => {
    const todoItemId = lambdaEvent.pathParameters.todoId;
    loggerInstance.info(`Processing Event GenerateUploadUrl ${todoItemId}`);

    const requestBody = JSON.parse(lambdaEvent.body);
    const userId = getUserId(lambdaEvent);

    const uploadUrl = await generateAttachmentSignUrl(todoItemId);
    const attachmentUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${todoItemId}`;
    
    await updateTodoAttachmentUrl(userId, todoItemId, requestBody, attachmentUrl);

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    };
  });
