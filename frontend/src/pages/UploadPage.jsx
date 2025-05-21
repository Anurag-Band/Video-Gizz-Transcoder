import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { videoApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { FiUploadCloud, FiX, FiCheck, FiFilm } from "react-icons/fi";
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
      <Card className="border border-primary/20 shadow-xl rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-b border-primary/20">
          <div className="flex items-center">
            <div className="bg-primary/20 p-3 rounded-full mr-4">
              <FiUploadCloud className="text-primary w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-primary text-2xl">
                Upload a New Video
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Share your creativity with the community
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 px-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 flex items-start">
                <FiX className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  disabled={loading}
                  required
                  className="border-primary/20 focus-visible:ring-primary rounded-lg py-2.5"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-foreground font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  disabled={loading}
                  rows={4}
                  className="border-primary/20 focus-visible:ring-primary rounded-lg resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video" className="text-foreground font-medium">
                  Video File <span className="text-red-500">*</span>
                </Label>

                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5 hover:bg-primary/10 transition-colors">
                  {file ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiFilm className="w-8 h-8 text-primary mr-3" />
                        <div>
                          <p className="font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="border-red-300 hover:bg-red-50 text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiUploadCloud className="w-12 h-12 text-primary/60 mx-auto mb-2" />
                      <p className="text-foreground font-medium mb-1">
                        Drag and drop your video here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supported formats: MP4, WebM, MOV, AVI
                      </p>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("video").click()}
                        className="border-primary/30 bg-white hover:bg-primary/10 text-black cursor-pointer"
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {loading && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">
                      Upload Progress
                    </span>
                    <span className="text-primary font-medium">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 flex items-center">
                    <FiCheck className="w-4 h-4 mr-1" />
                    {progress < 100
                      ? "Uploading and transcoding video..."
                      : "Processing complete!"}
                  </p>
                </div>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-t border-primary/20 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="border-gray-300 hover:bg-white/80 text-gray-200 font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadPage;

