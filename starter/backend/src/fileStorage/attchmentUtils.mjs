import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

//const XAWS = AWSXRay.captureAWS(AWS)
const s3BucketName = process.env.TODO_S3_BUCKET
const urlExpirationTime = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {
  constructor(
    s3 = new S3Client(),
    bucketName = s3BucketName,
    urlExpiration = urlExpirationTime
  ) {
    this.s3 = s3
    this.bucketName = bucketName
    this.urlExpiration = urlExpiration
  }
  getAttachmentUrl(todoId) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }

  async getUploadUrl(todoId) {
    console.log('urlExpirationTime', urlExpirationTime)
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: todoId
    })
    const url = await getSignedUrl(this.s3, command, {
      expiresIn: urlExpirationTime
    })
    return url
  }
}
