import axios from 'axios'

const API_URL = 'http://localhost:2000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Video API
export const videoApi = {
  // Get all videos with pagination
  getVideos: async (page = 1) => {
    try {
      const response = await api.get(`/videos?page=${page}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch videos' }
    }
  },

  // Get user's videos
  getUserVideos: async (page = 1) => {
    try {
      const response = await api.get(`/videos/my-videos?page=${page}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your videos' }
    }
  },

  // Get video by ID
  getVideoById: async (id) => {
    try {
      const response = await api.get(`/videos/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch video' }
    }
  },

  // Upload video
  uploadVideo: async (formData) => {
    try {
      const response = await api.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload video' }
    }
  },
}

export default api
