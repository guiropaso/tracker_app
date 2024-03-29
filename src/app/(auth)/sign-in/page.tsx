import Header from "@/components/Header";
import SignIn from "@/components/SignIn";
import SignInHeader from "@/components/SignInHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function page() {
  return (
    <>
        <SignInHeader />
        <div className="absolute inset-0">
            <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
              <div className="border p-6 rounded-lg">
                <SignIn />
              </div>
            </div>
        </div>
    </>
  )
}
