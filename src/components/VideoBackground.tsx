import React from 'react';

interface VideoBackgroundProps {
  video: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ video }) => {
  return (
    <video
      autoPlay
      loop
      muted
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
    >
      <source src={video} type="video/mp4" />
    </video>
  );
};

export default VideoBackground;
