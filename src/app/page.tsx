"use client";

import { Navbar } from "@/components/Navbar";
import { WebWallet } from "@/components/Wallet";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen overflow-auto w-full">
      <Navbar />
      <WebWallet />
    </div>
  );
}
