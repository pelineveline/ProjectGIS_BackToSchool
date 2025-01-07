import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { usePage } from '@inertiajs/react';

const Login = () => {
    const { props } = usePage();  // Get props from Inertia, including flash messages
    const errorMessage = props.flash.error;  // Access the error flash message

    return (
        <UserLayout>
            <div className="min-h-screen flex flex-col items-center justify-center text-black font-mono">
                <div className="flex flex-col items-center px-4 lg:px-0"> {/* Adjust padding for smaller screens */}
                    <div className="flex flex-col items-center mb-7">
                        <h1 className="font-black text-5xl sm:text-7xl md:text-9xl">ADMIN</h1> {/* Font sizes for different screen sizes */}
                        <h2 className="font-black text-xl sm:text-2xl md:text-3xl mt-4">LOGIN PAGE</h2>
                    </div>

                    {/* Flash message area */}
                    {errorMessage && (
                        <div className="mt-4 p-2 bg-red-600 text-white rounded-lg">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex justify-center">
                        <a href="/auth/google/redirect">
                            <button className="flex items-center justify-center bg-white text-black font-extrabold rounded-[1.5rem] w-full sm:w-[280px] md:w-[350px] lg:w-[400px] h-[60px] md:h-[75px] shadow-lg px-
                                                hover:bg-black hover:text-white">
                                <img
                                    src="/GoogleLogo.svg"
                                    alt="Google"
                                    className="w-6 h-6 md:w-8 md:h-8 mr-2"
                                />
                                <span className="text-xs sm:text-sm md:text-lg">MASUK DENGAN GOOGLE</span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default Login;
