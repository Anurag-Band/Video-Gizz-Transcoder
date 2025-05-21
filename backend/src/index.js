import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import connectDB from './config/db.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import videoRoutes from './routes/videoRoutes.js'

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const port = process.env.PORT || 2000

const app = express()

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Session middleware
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    })
)

// Passport middleware
app.use(passport.initialize())

// Static files
app.use('/hls-output', express.static(path.join(process.cwd(), 'hls-output')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)

// Legacy route for backward compatibility
app.post('/api/upload', (req, res) => {
    res.status(301).json({
        message: 'This endpoint is deprecated. Please use /api/videos instead.',
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
})

// Start server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})
