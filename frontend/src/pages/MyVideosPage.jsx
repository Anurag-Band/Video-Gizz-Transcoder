import { useState, useEffect } from 'react'
import { videoApi } from '../services/api'
import VideoGrid from '../components/VideoGrid'
import Pagination from '../components/Pagination'

const MyVideosPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        setLoading(true)
        const data = await videoApi.getUserVideos(page)
        setVideos(data.videos)
        setTotalPages(data.totalPages)
        setError(null)
      } catch (error) {
        console.error('Error fetching my videos:', error)
        setError('Failed to load your videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchMyVideos()
  }, [page])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Videos</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <VideoGrid videos={videos} loading={loading} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default MyVideosPage
