"use client";
import { useLogoutMutation } from "@/services/userApi";
import { useRouter } from "next/navigation";
import React from "react";
import Tasks from "./tasks";
import toast from "react-hot-toast";

const Main = () => {
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logout({}).unwrap();
      
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
          Logout
        </button>
      </div>
      <Tasks />
    </div>
  );
};

export default Main;
