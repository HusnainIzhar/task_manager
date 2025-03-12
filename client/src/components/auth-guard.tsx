"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGetUserQuery } from "@/services/userApi";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data, isLoading, isError, error } = useGetUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (!isLoading) {
      if (isError || !data) {
        console.error("Authentication failed:", error);
        toast.error("Please login to access this page");
        router.push("/");
      } else {
        console.log("User authenticated:", data);
        setIsAuthenticated(true);
      }
    }
  }, [isLoading, isError, data, error, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <p className="ml-3 text-white">Verifying authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
