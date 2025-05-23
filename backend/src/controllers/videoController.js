import fs from 'fs'
import { exec } from 'child_process'
import { v4 as uuid } from 'uuid'
import path from 'path'
import Video from '../models/Video.js'
import { uploadDirectoryToS3, uploadFileToS3 } from '../services/s3Service.js'

// Helper function to get video duration using ffprobe
const getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`ffprobe error: ${error}`)
                    reject(error)
                } else {
                    resolve(parseFloat(stdout.trim()))
                }
            }
        )
    })
}

// @desc    Upload and transcode video with optional thumbnail
// @route   POST /api/videos
// @access  Private
export const uploadVideo = async (req, res) => {
    try {
        // Check if video file exists in the request
        if (!req.files || !req.files.video || !req.files.video[0]) {
            return res.status(400).json({ message: 'Video not sent!' })
        }

        const { title, description } = req.body

        if (!title) {
            return res.status(400).json({ message: 'Title is required' })
        }

        const videoId = uuid()
        const uploadedVideoPath = req.files.video[0].path
        const originalFilename = req.files.video[0].originalname

        // Check if thumbnail was uploaded
        const thumbnailFile = req.files.thumbnail && req.files.thumbnail[0]

        // Get video duration
        let duration = 0
        try {
            duration = await getVideoDuration(uploadedVideoPath)
        } catch (error) {
            console.error(`Failed to get video duration: ${error}`)
            // Continue processing even if duration extraction fails
        }

        const outputFolderRootPath = `./hls-output/${videoId}`

        const outputFolderSubDirectoryPath = {
            '360p': `${outputFolderRootPath}/360p`,
            '480p': `${outputFolderRootPath}/480p`,
            '720p': `${outputFolderRootPath}/720p`,
            '1080p': `${outputFolderRootPath}/1080p`,
        }

        // Create directories for storing output video
        if (!fs.existsSync(outputFolderRootPath)) {
            fs.mkdirSync(outputFolderSubDirectoryPath['360p'], { recursive: true })
            fs.mkdirSync(outputFolderSubDirectoryPath['480p'], { recursive: true })
            fs.mkdirSync(outputFolderSubDirectoryPath['720p'], { recursive: true })
            fs.mkdirSync(outputFolderSubDirectoryPath['1080p'], { recursive: true })
        }

        // Commands to convert video to HLS format for 360p, 480p, 720p, 1080p resolutions
        const ffmpegCommands = [
            `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=640:h=360" -c:v libx264 -b:v 800k -c:a aac -b:a 96k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['360p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['360p']}/index.m3u8"`,
            `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=854:h=480" -c:v libx264 -b:v 1400k -c:a aac -b:a 128k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['480p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['480p']}/index.m3u8"`,
            `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=1280:h=720" -c:v libx264 -b:v 2800k -c:a aac -b:a 128k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['720p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['720p']}/index.m3u8"`,
            `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=1920:h=1080" -c:v libx264 -b:v 5000k -c:a aac -b:a 192k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['1080p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['1080p']}/index.m3u8"`,
        ]

        // run the ffmpeg command in a queue
        const executeCommand = (command) => {
            return new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`)
                        reject(error)
                    } else {
                        resolve()
                    }
                })
            })
        }

        await Promise.all(ffmpegCommands.map((cmd) => executeCommand(cmd)))

        // Create master playlist file
        const masterPlaylistContent = `#EXTM3U
                            #EXT-X-VERSION:3
                            #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
                            360p/index.m3u8
                            #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
                            480p/index.m3u8
                            #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
                            720p/index.m3u8
                            #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
                            1080p/index.m3u8`

        // Write the master playlist file
        fs.writeFileSync(`${outputFolderRootPath}/index.m3u8`, masterPlaylistContent)

        // Upload transcoded videos to S3
        console.log('Uploading transcoded videos to S3...')
        const s3Prefix = `videos/${videoId}`
        const s3Urls = await uploadDirectoryToS3(outputFolderRootPath, s3Prefix)

        // Create video URLs pointing to S3
        const videoUrls = {
            master: s3Urls['index.m3u8'],
            '360p': s3Urls['360p/index.m3u8'],
            '480p': s3Urls['480p/index.m3u8'],
            '720p': s3Urls['720p/index.m3u8'],
            '1080p': s3Urls['1080p/index.m3u8'],
        }

        // Upload thumbnail to S3 if provided
        let thumbnailUrl = null
        if (thumbnailFile) {
            try {
                console.log('Uploading thumbnail to S3...')
                const thumbnailKey = `thumbnails/${videoId}/${thumbnailFile.originalname}`
                thumbnailUrl = await uploadFileToS3(thumbnailFile.path, thumbnailKey)
                console.log('Thumbnail uploaded successfully:', thumbnailUrl)
            } catch (thumbnailError) {
                console.error(`Error uploading thumbnail: ${thumbnailError}`)
                // Continue even if thumbnail upload fails
            }
        }

        // Save video to database
        const video = await Video.create({
            videoId,
            title,
            description,
            user: req.user._id,
            videoUrls,
            thumbnailUrl,
            originalFilename,
            duration,
        })

        // Clean up local files after successful upload to S3
        try {
            // Remove the original uploaded video
            fs.unlinkSync(uploadedVideoPath)

            // Remove the thumbnail file if it exists
            if (thumbnailFile && thumbnailFile.path) {
                fs.unlinkSync(thumbnailFile.path)
            }

            // Remove the transcoded files
            fs.rmSync(outputFolderRootPath, { recursive: true, force: true })

            console.log('Local files cleaned up successfully')
        } catch (cleanupError) {
            console.error(`Error cleaning up local files: ${cleanupError}`)
            // Continue even if cleanup fails
        }

        return res.status(201).json(video)
    } catch (error) {
        console.error(`Video upload error: ${error}`)
        return res.status(500).json({ message: 'Video upload failed' })
    }
}

// @desc    Get all videos with pagination
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 9 // Exactly 9 videos per page as requested

        const count = await Video.countDocuments()
        const totalPages = Math.ceil(count / limit)

        const videos = await Video.find()
            .sort({ createdAt: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'name avatar')

        res.json({
            videos,
            page,
            totalPages,
            totalVideos: count,
        })
    } catch (error) {
        console.error(`Get videos error: ${error}`)
        res.status(500).json({ message: 'Failed to fetch videos' })
    }
}

// @desc    Get user's videos
// @route   GET /api/videos/my-videos
// @access  Private
export const getUserVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 9

        const count = await Video.countDocuments({ user: req.user._id })
        const totalPages = Math.ceil(count / limit)

        const videos = await Video.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        res.json({
            videos,
            page,
            totalPages,
            totalVideos: count,
        })
    } catch (error) {
        console.error(`Get user videos error: ${error}`)
        res.status(500).json({ message: 'Failed to fetch your videos' })
    }
}

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: req.params.id }).populate(
            'user',
            'name avatar'
        )

        if (!video) {
            return res.status(404).json({ message: 'Video not found' })
        }

        res.json(video)
    } catch (error) {
        console.error(`Get video error: ${error}`)
        res.status(500).json({ message: 'Failed to fetch video' })
    }
}
