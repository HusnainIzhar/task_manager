"use client";
import React from 'react';
import Main from "../../components/main";
import AuthGuard from "@/components/auth-guard";

const Page = () => {
  return (
    <AuthGuard>
      <Main/>
    </AuthGuard>
  );
}

export default Page;