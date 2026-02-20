import React from "react";
import CouchWide from "@/components/banners/couchWide";

const banners = () => {
  return (
    <div className="min-h-screen p-20 w-full flex items-center justify-center bg-[#ececec] dark:bg-[#2e2b2b] text-[#161310] dark:text-stone-300">
      <CouchWide />
    </div>
  );
};

export default banners;
