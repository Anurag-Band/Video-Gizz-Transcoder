import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { videoApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const UploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid video file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!file) {
      setError("Please select a video file");
      return;
    }

    try {
      setLoading(true);
      setProgress(10);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      const response = await videoApi.uploadVideo(formData);

      clearInterval(progressInterval);
      setProgress(100);

      // Navigate to the video page
      navigate(`/video/${response.videoId}`);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload video");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">Upload Video</h1>

      <Card className="border border-primary/20 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Upload a New Video</CardTitle>
          <CardDescription>
            Share your creativity with the community
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  disabled={loading}
                  required
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  disabled={loading}
                  rows={4}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video" className="text-foreground">
                  Video File *
                </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="cursor-pointer border-primary/20 focus-visible:ring-primary"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: MP4, WebM, MOV, AVI
                </p>
              </div>

              {loading && (
                <div className="w-full bg-secondary rounded-full h-2.5 mt-4">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {progress < 100
                      ? "Uploading and transcoding video..."
                      : "Processing complete!"}
                  </p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between bg-primary/5 border-t border-primary/20">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="border-primary/20 hover:bg-primary/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadPage;

