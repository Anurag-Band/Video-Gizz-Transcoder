import express from 'express'
import { 
    uploadVideo, 
    getVideos, 
    getUserVideos, 
    getVideoById 
} from '../controllers/videoController.js'
import { protect } from '../middlewares/auth.js'
import { uploader } from '../middlewares/uploader.js'

const router = express.Router()

// @route   POST /api/videos
// @desc    Upload and transcode video
// @access  Private
router.post('/', protect, uploader('video'), uploadVideo)

// @route   GET /api/videos
// @desc    Get all videos with pagination
// @access  Public
router.get('/', getVideos)

// @route   GET /api/videos/my-videos
// @desc    Get user's videos
// @access  Private
router.get('/my-videos', protect, getUserVideos)

// @route   GET /api/videos/:id
// @desc    Get video by ID
// @access  Public
router.get('/:id', getVideoById)

export default router
