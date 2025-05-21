import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const VideoCard = ({ video }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/video/${video.videoId}`}>
        <div className="aspect-video bg-muted relative overflow-hidden">
          {/* Video thumbnail placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary/70"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </Link>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg truncate">
          <Link to={`/video/${video.videoId}`} className="hover:text-primary">
            {video.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {video.description || 'No description provided'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {video.user && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={video.user.avatar} alt={video.user.name} />
              <AvatarFallback>
                {video.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {video.user.name}
            </span>
          </div>
        )}
        <span className="text-xs text-muted-foreground">
          {formatDate(video.createdAt)}
        </span>
      </CardFooter>
    </Card>
  )
}

export default VideoCard
