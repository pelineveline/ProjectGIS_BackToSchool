import React from "react";
import UserLayout from "@/Layouts/UserLayout";

const Login = () => {
    return (
        <UserLayout>
            <div className="container mx-auto py-10 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <div className="max-w-md bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="mb-4 text-gray-700">
                        Klik tombol di bawah untuk login menggunakan akun Google.
                    </p>
                    {/* Tombol Login dengan Google */}
                    <a
                        href="/auth/google/redirect"
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 inline-block"
                    >
                        Login dengan Google
                    </a>
                </div>
            </div>
        </UserLayout>
    );
};

export default Login;
