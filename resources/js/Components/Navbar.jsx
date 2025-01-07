import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const Navbar = () => {
    const { url } = usePage(); // Mendapatkan URL saat ini
    const isActive = (path) => url === path; // Mengecek apakah URL aktif
    const [isAdmin, setIsAdmin] = useState(false); // State untuk admin

    // Cek role pengguna dari API Laravel
    useEffect(() => {
        fetch("/api/check-role") // Endpoint untuk cek role
            .then((response) => response.json())
            .then((data) => setIsAdmin(data.isAdmin === 1)) // Set true jika admin
            .catch((error) => console.error("Error checking role:", error));
    }, []);

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-black font-mono">
                    <Link href="/" className="text-gray-800">
                        Back To School
                    </Link>
                </div>

                {/* Menu Items */}
                <div className="space-x-6">
                    <Link
                        href="/"
                        className={`${isActive("/") ? "bg-black text-white py-2 px-4 transition-all duration-300" : "text-black transition-all duration-300"} font-mono rounded-lg hover:text-white hover:text-lg hover:bg-zinc-300 hover:py-1 hover:px-3`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/peta"
                        className={`${isActive("/peta") ? "bg-black text-white py-2 px-4 transition-all duration-300" : "text-black transition-all duration-300"} font-mono rounded-lg hover:text-white hover:text-lg hover:bg-zinc-300 hover:py-1 hover:px-3`}
                    >
                        Peta
                    </Link>
                    <Link
                        href="/list-sekolah"
                        className={`${isActive("/list-sekolah") ? "bg-black text-white py-2 px-4 transition-all duration-300" : "text-black transition-all duration-300"} font-mono rounded-lg hover:text-white hover:text-lg hover:bg-zinc-300 hover:py-1 hover:px-3`}
                    >
                        Sekolah
                    </Link>
                    {isAdmin ? (
                        <Link
                            href="/list-admin"
                            className={`${isActive("/list-admin") ? "bg-black text-white py-2 px-4 transition-all duration-300" : "text-black transition-all duration-300"} font-mono rounded-lg hover:text-white hover:text-lg hover:bg-zinc-300 hover:py-1 hover:px-3`}
                        >
                            Admin
                        </Link>
                    ) : (
                        ""
                    )
                    }
                </div>

                {/* Login/Logout Button */}
                <div>
                    {isAdmin ? (
                        <Link
                            href="/admin/logout"
                            className="bg-red-500 text-white py-2 px-4 transition-all duration-300 font-mono rounded-lg hover:text-white hover:text-lg hover:bg-red-700 hover:py-1 hover:px-3"
                        >
                            Logout
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-black text-white py-2 px-4 transition-all duration-300 font-mono rounded-lg hover:text-white hover:text-lg hover:bg-zinc-300 hover:py-1 hover:px-3"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
