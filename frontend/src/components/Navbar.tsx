"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left side: Logo */}
      <div className="flex items-center space-x-4">
        <button className="text-xl font-bold hover:text-blue-400">
          <Image src="/cyber-logo.png" alt="Logo" className="h-8 w-8 inline-block mr-2"  width={35} height={35}/>
          <Link href="/">Cyber Security</Link>
        </button>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex space-x-6">
        <Link href="/overview" className="hover:text-blue-400 cursor-pointer">Overview</Link>
        <Link href="/kernel-modules" className="hover:text-blue-400 cursor-pointer">Kernel Modules</Link>
        <Link href="/firewall-rules" className="hover:text-blue-400 cursor-pointer">Firewall Rules</Link>
        <Link href="/api-interface" className="hover:text-blue-400 cursor-pointer">API Interface</Link>
        <Link href="/logs-testing" className="hover:text-blue-400 cursor-pointer">Logs & Testing</Link>
        <Link href="/settings" className="hover:text-blue-400 cursor-pointer">Settings</Link>
        <Link href="/profile" className="hover:text-blue-400 cursor-pointer">Profile</Link>
      </div>

      {/* Right side: Home icon */}
      <div>
        <Link href="/" aria-label="Home">
          <Home className="w-6 h-6 hover:text-blue-400" />
        </Link>
      </div>
    </nav>
  );
}