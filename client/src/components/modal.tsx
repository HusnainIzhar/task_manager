"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginSignup } from "./loginSignUp";

export function Modal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-transparent">
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-zinc-950">
        <div className="mt-5">
          <LoginSignup />
        </div>
      </DialogContent>
    </Dialog>
  );
}
