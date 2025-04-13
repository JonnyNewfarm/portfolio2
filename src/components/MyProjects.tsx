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
    <div className="h-screen bg-[#ecebeb] flex justify-end">
      <div className="w-[35vw] h-screen">
        <img src="/myrecent.jpg" className="object-cover h-full" alt="" />
      </div>
    </div>
  );
};

export default MyProjects;
