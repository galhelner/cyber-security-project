import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left: Credits */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="text-sm">© {new Date().getFullYear()} Cyber Secuirity Project</p>
          <p className="text-sm">Built with Next.js & React ⚡</p>
        </div>

        {/* Right: Website Map */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/overview" className="hover:text-blue-400 text-sm">Overview</Link>
          <Link href="/kernel-modules" className="hover:text-blue-400 text-sm">Kernel Modules</Link>
          <Link href="/firewall-rules" className="hover:text-blue-400 text-sm">Firewall Rules</Link>
          <Link href="/api-interface" className="hover:text-blue-400 text-sm">API Interface</Link>
          <Link href="/logs-testing" className="hover:text-blue-400 text-sm">Logs & Testing</Link>
          <Link href="/settings" className="hover:text-blue-400 text-sm">Settings</Link>
          <Link href="/profile" className="hover:text-blue-400 text-sm">Profile</Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="text-center text-xs text-gray-500 mt-4 border-t border-gray-700 pt-2">
        Designed with ❤️ by Gal Helner
      </div>
    </footer>
  );
}