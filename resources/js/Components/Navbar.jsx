import React from "react";
import { Link } from "@inertiajs/react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-semibold">
          <Link href="/" className="text-gray-800">
            Back To School
          </Link>
        </div>

        {/* Menu Items */}
        <div className="space-x-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            Peta
          </Link>
          <Link
            href="/list-sekolah"
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            Sekolah
          </Link>
        </div>

        {/* Login Button */}
        <div>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
