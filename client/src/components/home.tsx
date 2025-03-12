"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Modal } from "./modal";

export function Home() {
  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden items-center">
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Task Manager
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          A simple task manager to keep you organized.
        </p>
        <div className="flex justify-center mt-5">
          <Modal />
        </div>
      </div>
    </div>
  );
}
