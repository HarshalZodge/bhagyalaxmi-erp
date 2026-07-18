"use client";

import React from "react";
import { LuxuryStorytellingView } from "@/views/LuxuryStorytellingView";

export default function Home() {
  const handleStartBooking = () => {
    window.location.href = "/client";
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F2]">
      <LuxuryStorytellingView onStartBooking={handleStartBooking} />
    </div>
  );
}
