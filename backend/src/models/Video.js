import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema(
    {
        videoId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        videoUrls: {
            master: String,
            '360p': String,
            '480p': String,
            '720p': String,
            '1080p': String,
        },
        thumbnailUrl: {
            type: String,
            default: null,
        },
        originalFilename: {
            type: String,
        },
        duration: {
            type: Number, // duration in seconds
        },
    },
    {
        timestamps: true,
    }
)

// Index for pagination and sorting
videoSchema.index({ createdAt: -1 })
videoSchema.index({ user: 1, createdAt: -1 })

const Video = mongoose.model('Video', videoSchema)

export default Video

