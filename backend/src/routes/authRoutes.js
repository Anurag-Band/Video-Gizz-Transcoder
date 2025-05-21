import express from 'express'
import passport from 'passport'
import { getCurrentUser, googleCallback } from '../controllers/authController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    googleCallback
)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser)

export default router
