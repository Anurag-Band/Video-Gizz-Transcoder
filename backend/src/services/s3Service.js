import { S3Client } from '@aws-sdk/client-s3'
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Function to get S3 client
const getS3Client = () => {
    // Check if required environment variables are set
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS credentials not found in environment variables')
    }

    return new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    })
}

// Function to get S3 bucket name
const getBucketName = () => {
    // Check for both possible environment variable names
    const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME

    if (!bucketName) {
        throw new Error('S3 bucket name not found in environment variables (AWS_S3_BUCKET_NAME or S3_BUCKET_NAME)')
    }

    return bucketName
}

/**
 * Upload a file to S3
 * @param {string} filePath - Local file path
 * @param {string} key - S3 object key (path in bucket)
 * @returns {Promise<string>} - S3 URL of the uploaded file
 */
export const uploadFileToS3 = async (filePath, key) => {
    try {
        const s3Client = getS3Client()
        const bucketName = getBucketName()
        const fileContent = fs.readFileSync(filePath)

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: getContentType(filePath)
        }

        await s3Client.send(new PutObjectCommand(params))

        // Return the S3 URL
        return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    } catch (error) {
        console.error(`Error uploading file to S3: ${error}`)
        throw error
    }
}

/**
 * Upload a directory to S3 recursively
 * @param {string} dirPath - Local directory path
 * @param {string} s3Prefix - S3 prefix (directory in bucket)
 * @returns {Promise<Object>} - Object with S3 URLs of uploaded files
 */
export const uploadDirectoryToS3 = async (dirPath, s3Prefix) => {
    try {
        const urls = {}

        // Read all files in the directory
        const files = getAllFiles(dirPath)

        // Upload each file to S3
        for (const file of files) {
            const relativePath = path.relative(dirPath, file)
            const s3Key = path.join(s3Prefix, relativePath).replace(/\\/g, '/')

            const s3Url = await uploadFileToS3(file, s3Key)

            // Store the URL with a key that represents the file path
            const urlKey = relativePath.replace(/\\/g, '/')
            urls[urlKey] = s3Url
        }

        return urls
    } catch (error) {
        console.error(`Error uploading directory to S3: ${error}`)
        throw error
    }
}

/**
 * Get a signed URL for an S3 object (for temporary access)
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} - Signed URL
 */
export const getSignedS3Url = async (key, expiresIn = 3600) => {
    try {
        const s3Client = getS3Client()
        const bucketName = getBucketName()

        const params = {
            Bucket: bucketName,
            Key: key
        }

        const command = new GetObjectCommand(params)
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })

        return signedUrl
    } catch (error) {
        console.error(`Error generating signed URL: ${error}`)
        throw error
    }
}

/**
 * Delete an object from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export const deleteFileFromS3 = async (key) => {
    try {
        const s3Client = getS3Client()
        const bucketName = getBucketName()

        const params = {
            Bucket: bucketName,
            Key: key
        }

        await s3Client.send(new DeleteObjectCommand(params))
    } catch (error) {
        console.error(`Error deleting file from S3: ${error}`)
        throw error
    }
}

/**
 * Get all files in a directory recursively
 * @param {string} dirPath - Directory path
 * @returns {Array<string>} - Array of file paths
 */
const getAllFiles = (dirPath) => {
    const files = []

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stats = fs.statSync(itemPath)

        if (stats.isDirectory()) {
            files.push(...getAllFiles(itemPath))
        } else {
            files.push(itemPath)
        }
    }

    return files
}

/**
 * Get content type based on file extension
 * @param {string} filePath - File path
 * @returns {string} - Content type
 */
const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase()

    const contentTypes = {
        '.m3u8': 'application/x-mpegURL',
        '.ts': 'video/MP2T',
        '.mp4': 'video/mp4',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
    }

    return contentTypes[ext] || 'application/octet-stream'
}
