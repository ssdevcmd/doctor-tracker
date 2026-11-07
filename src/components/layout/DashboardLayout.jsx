"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f8fb]">
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <div className="min-h-screen lg:pl-[264px]">
        <Header onMenuClick={() => setIsOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
          {children}
        </main>
      </div>
    </div>
  );
}