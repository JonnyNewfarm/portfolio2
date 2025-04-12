"use client";
import React, { useEffect, useRef } from "react";

const MyProjects = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch((err) => console.error("Autoplay failed:", err));
    }
  }, []);
  return (
    <div className="bg-[#ecebeb] h-screen flex justify-center gap-x-20 items-center">
      <div className="text-6xl font-serif uppercase text-center">
        <h1>Check out</h1>
        <h1>My projects</h1>
      </div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-[30vw]"
        >
          <source src="/canvas-video.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default MyProjects;
