import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Play } from "lucide-react";

const VideoCard = ({ video }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate a random gradient for the thumbnail background
  const getRandomGradient = () => {
    const gradients = [
      "from-purple-500/20 to-pink-500/20",
      "from-blue-500/20 to-purple-500/20",
      "from-indigo-500/20 to-purple-500/20",
      "from-violet-500/20 to-fuchsia-500/20",
      "from-purple-500/20 to-indigo-500/20",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="overflow-hidden hover-lift gradient-border">
      <Link to={`/video/${video.videoId}`} className="block">
        <div className="aspect-video bg-primary/5 relative overflow-hidden group">
          {/* Video thumbnail or gradient background */}
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getRandomGradient()}`}
            />
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>

          {/* Video duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {video.duration ? formatDuration(video.duration) : "--:--"}
          </div>
        </div>
      </Link>

      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-base truncate">
          <Link
            to={`/video/${video.videoId}`}
            className="hover:text-primary transition-colors"
          >
            {video.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {video.description || "No description provided"}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        {video.user && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6 ring-1 ring-primary/20">
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
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          {formatDate(video.createdAt)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;

