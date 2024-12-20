import React from "react";
import Navbar from "@/Components/Navbar";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default UserLayout;
