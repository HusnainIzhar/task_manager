"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegisterMutation, useLoginMutation } from "@/services/userApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function LoginSignup() {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    name: "",
  });

  const handleRegistrationValidation = () => {
    if (!form.email || !form.password || !form.name) {
      toast.error("Please fill all the fields");
      return false;
    }
    return true;
  };
  const handleRegister = async () => {
    try {
      if (!handleRegistrationValidation()) return;
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
      }).unwrap();
      toast.success("Account created successfully");
      setForm({ email: "", password: "", name: "" }); 
      document
        .querySelector('[value="account"]')
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } catch (error) {
      const errorResponse = error as { data?: { message?: string } };
      toast.error(errorResponse?.data?.message || "Failed to create account");
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) {
        toast.error("Please fill all the fields");
        return;
      }
      await login({
        email: form.email,
        password: form.password,
      }).unwrap();

      // The server will set the token as an HTTP-only cookie
      toast.success("Logged in successfully");
      // Navigate to the task page
      router.push("/task");
    } catch (error) {
      const errorResponse = error as { data?: { message?: string } };
      toast.error(errorResponse?.data?.message || "Failed to login");
      console.error(error);
    }
  };
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Login</TabsTrigger>
        <TabsTrigger value="password">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to your account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleLogin}
              className="bg-transparent text-white border hover:bg-black cursor-pointer"
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Register for an account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Name</Label>
              <Input
                id="current"
                type="name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="current">Email</Label>
              <Input
                id="current"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Password</Label>
              <Input
                id="new"
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleRegister}
              className="bg-transparent text-white border hover:bg-black cursor-pointer"
            >
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
