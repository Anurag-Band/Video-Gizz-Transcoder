import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { videoApi } from '../services/api'
import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'

const VideoPage = () => {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const data = await videoApi.getVideoById(id)
        setVideo(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching video:', error)
        setError('Failed to load video. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVideo()
    }
  }, [id])

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full aspect-video bg-muted/30 rounded-lg animate-pulse mb-4"></div>
        <div className="h-8 bg-muted/30 rounded w-1/3 animate-pulse mb-2"></div>
        <div className="h-4 bg-muted/30 rounded w-1/4 animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            Video not found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The video you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {video.videoUrls && (
            <EnhancedVideoPlayer
              title={video.title}
              user={video.user}
              videoUrls={video.videoUrls}
            />
          )}

          <div className="mt-6">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {video.user && (
                  <>
                    <Avatar>
                      <AvatarImage src={video.user.avatar} alt={video.user.name} />
                      <AvatarFallback>
                        {video.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{video.user.name}</span>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Uploaded on {formatDate(video.createdAt)}
              </span>
            </div>

            {video.description && (
              <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="whitespace-pre-line">{video.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Placeholder for related videos or additional info */}
          <div className="bg-muted/10 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Video Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution</span>
                <span>Up to 1080p</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Format</span>
                <span>HLS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adaptive</span>
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPage
