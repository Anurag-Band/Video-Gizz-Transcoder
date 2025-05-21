import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'
import { generateToken } from '../middlewares/auth.js'
import dotenv from 'dotenv'

dotenv.config()

// Configure Passport
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id })

                if (!user) {
                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                    })
                }

                return done(null, user)
            } catch (error) {
                return done(error, null)
            }
        }
    )
)

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

// Handle Google OAuth callback
export const googleCallback = (req, res) => {
    try {
        // Generate JWT token
        const token = generateToken(req.user._id)

        // Redirect to client with token
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    } catch (error) {
        res.status(500).json({ message: 'Authentication failed' })
    }
}
