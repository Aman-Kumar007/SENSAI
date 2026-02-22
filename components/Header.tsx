import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  PenBox,
  StarsIcon,
  UserPen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <div className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="SensAi Logo"
            width={200}
            height={60}
            className="h-13 py-1 w-auto object-contain "
          />
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            {/* Dashboard Link */}
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            {/* Profile Link  */}
            <Link href="/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <UserPen className="h-4 w-4" />
                <span className="hidden md:block">Edit Profile</span>
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>
      <StarsIcon className="h-4 w-4" />
      <span className="hidden md:block">Growth Tools</span>
    </Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent>
    {/* 1. Add 'asChild' to DropdownMenuItem */}
    <DropdownMenuItem asChild>
      {/* 2. Add 'cursor-pointer' to the Link so it feels like a button */}
      <Link href={"/resume"} className="cursor-pointer flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span>Build Resume</span>
      </Link>
    </DropdownMenuItem>

    <DropdownMenuItem asChild>
      <Link
        href={"/ai-cover-letter"}
        className="cursor-pointer flex items-center gap-2"
      >
        <PenBox className="h-4 w-4" />
        <span>Cover Letter</span>
      </Link>
    </DropdownMenuItem>

    <DropdownMenuItem asChild>
      <Link href={"/interview"} className="cursor-pointer flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        <span>Interview Prep</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href={"/chat"} className="cursor-pointer flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span>Chat with Ai</span>
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="outline">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
