import VideoCard from './VideoCard'

const VideoGrid = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="video-grid">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="bg-primary/5 rounded-lg h-64 animate-pulse overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="h-2 w-2/3 bg-primary/20 rounded absolute bottom-4 left-4 animate-pulse" style={{ animationDelay: `${index * 0.1}s` }} />
            <div className="h-2 w-1/3 bg-primary/20 rounded absolute bottom-8 left-4 animate-pulse" style={{ animationDelay: `${index * 0.15}s` }} />
          </div>
        ))}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12 bg-primary/5 rounded-lg p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground">
          No videos found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There are no videos available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}

export default VideoGrid
