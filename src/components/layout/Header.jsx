"use client";

import { Menu, Search, Bell } from "lucide-react";

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Dashboard
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Welcome to Doctor Tracker
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-36 bg-transparent text-sm outline-none"
          />
        </div>

        <button
          className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
          A
        </div>
      </div>
    </header>
  );
}