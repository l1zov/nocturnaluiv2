const VideoBackground = ({ video }: { video: string }) => {
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
