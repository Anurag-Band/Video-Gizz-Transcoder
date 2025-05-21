import { useState, useEffect } from 'react'
import { videoApi } from '../services/api'
import VideoGrid from '../components/VideoGrid'
import Pagination from '../components/Pagination'

const HomePage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const data = await videoApi.getVideos(page)
        setVideos(data.videos)
        setTotalPages(data.totalPages)
        setError(null)
      } catch (error) {
        console.error('Error fetching videos:', error)
        setError('Failed to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [page])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Welcome to Video Gizz</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your modern platform for video transcoding and streaming. Discover, upload, and share videos with ease.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Discover Videos</h2>
        <VideoGrid videos={videos} loading={loading} />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default HomePage
