import React from "react";
import { FloatingDock } from "./floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { Heart, Sparkles, Music, User, Archive, Plus } from "lucide-react";

export default function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Create Soul Hug",
      icon: (
        <Heart className="h-full w-full text-purple-500 dark:text-purple-300" />
      ),
      href: "/define",
    },
    {
      title: "My Hugs",
      icon: (
        <Archive className="h-full w-full text-blue-500 dark:text-blue-300" />
      ),
      href: "/my-hugs",
    },
    {
      title: "Audio Studio",
      icon: (
        <Music className="h-full w-full text-green-500 dark:text-green-300" />
      ),
      href: "/audio-hug",
    },
    {
      title: "SoulLift",
      icon: (
        <Heart className="h-full w-full text-purple-600 dark:text-purple-300" />
      ),
      href: "/",
    },
    {
      title: "Profile",
      icon: (
        <User className="h-full w-full text-indigo-500 dark:text-indigo-300" />
      ),
      href: "/user-profile",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  
  return (
    <div className="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}