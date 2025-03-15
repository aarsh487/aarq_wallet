"use client";

import { Navbar } from "@/components/Navbar";
import { Wallet } from "@/components/Wallet";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen w-full">
      <Navbar />
      <Wallet />
    </div>
  );
}
