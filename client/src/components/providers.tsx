"use client";

import React from 'react';
import { Provider } from "react-redux";
import { store } from "../services/store";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        toastOptions={{
          style: { fontFamily: "sans-serif", border: "#3a3a3a" },
          error: { style: { background: "#ef4146", color: "white" } },
          success: { style: { background: "#47b881", color: "black" } },
        }}
      />
      <Provider store={store}>{children}</Provider>
    </>
  );
} 