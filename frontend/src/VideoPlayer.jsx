import { useEffect, useRef } from "react";
import videojs from "video.js";

import "video.js/dist/video-js.css";

const VideoPlayer = ({ videoUrls }) => {
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
    autoplay: true,
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
    <div
      data-vjs-player
      style={{
        width: "800px",
        height: "450px",
        margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
export default VideoPlayer;
