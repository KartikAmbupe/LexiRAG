import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, SignedIn } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();

  const navLink = (path, label) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
          isActive
            ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-md"
            : "text-gray-300 hover:text-white hover:bg-gray-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-[#0c0f1a] border-b border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:opacity-90 transition"
        >
          🧠 LexiRAG
        </Link>

        <div className="flex items-center gap-4">
          {navLink("/", "Home")}
          {navLink("/upload", "Upload")}
          {navLink("/library", "Library")}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
