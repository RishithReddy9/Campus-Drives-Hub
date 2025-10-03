import { Github, Heart, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left - Contribute */}
        <div className="flex items-center gap-2">
          <span>Want to contribute?</span>
          <Link
            href="https://github.com/RishithReddy9/Campus-Drives-Hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 dark:text-blue-300 hover:underline"
          >
            <Github size={18} />
            GitHub
          </Link>
        </div>

        {/* Center - Made with Heart */}
        <div className="flex items-center gap-1 text-md">
          <span>Made with</span>
          <Heart className="text-red-500 fill-red-500" size={16} />
          <span>by Team ISTE</span>
        </div>

        {/* Right - Contact + Socials */}
        <div className="flex flex-col md:items-end text-md gap-2">
          <p>
            Contact Us:{" "}
            <a
              href="mailto:iste@vnrvjiet.in"
              className="text-blue-600 dark:text-blue-300 hover:underline"
            >
              iste@vnrvjiet.in
            </a>
          </p>
          <div className="flex gap-4">
            <Link
              href="https://www.instagram.com/iste_vnrvjiet/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 transition"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/iste-vnrvjiet/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-300 py-3 border-t">
        © {new Date().getFullYear()} ISTE VNRVJIET. All rights reserved.
      </div>
    </footer>
  );
}
