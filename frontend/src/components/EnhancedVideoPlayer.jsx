import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const EnhancedVideoPlayer = ({ title, user, videoUrls }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const masterFileSrc = videoUrls?.master;

  const availableResolutions = [
    {
      label: "360p",
      src: videoUrls?.["360p"],
    },
    {
      label: "480p",
      src: videoUrls?.["480p"],
    },
    {
      label: "720p",
      src: videoUrls?.["720p"],
    },
    {
      label: "1080p",
      src: videoUrls?.["1080p"],
    },
  ];

  const options = {
    autoplay: false,
    controls: true,
    responsive: false,
    fluid: false,
    width: 800,
    height: 450,
    sources: [
      {
        src: masterFileSrc,
        type: "application/x-mpegURL",
      },
    ],
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
      children: [
        "playToggle",
        "volumePanel",
        "currentTimeDisplay",
        "timeDivider",
        "durationDisplay",
        "progressControl",
        "playbackRateMenuButton",
        "fullscreenToggle",
      ],
    },
  };

  const handleResolutionChange = (index) => {
    const player = playerRef.current;
    const currentTime = player.currentTime();

    player.src({
      src: availableResolutions[index].src,
      type: "application/x-mpegURL",
    });
    player.ready(() => {
      player.currentTime(currentTime);
    });
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options));

      // Append video resolution button
      availableResolutions.forEach((resolution, index) => {
        player.getChild("ControlBar").addChild("button", {
          controlText: resolution.label,
          className: "vjs-visible-text",
          clickHandler: () => {
            handleResolutionChange(index);
          },
        });
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className="w-full">
      <div
        data-vjs-player
        className="overflow-hidden rounded-lg shadow-lg"
        style={{ width: "800px", height: "450px", margin: "0 auto" }}
      >
        <div ref={videoRef} className="w-full h-full" />
      </div>
      {title && (
        <div className="mt-4" style={{ width: "800px", margin: "0 auto" }}>
          <h1 className="text-2xl font-bold">{title}</h1>
          {user && (
            <p className="text-sm text-muted-foreground mt-1">
              Uploaded by {user.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer;

