"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, FileText, User } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add", label: "New Entry", icon: PlusCircle },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 p-4">
        <div className="mb-8 pl-2">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            CareOctopus
          </h1>
          <p className="text-xs text-slate-400">AI Care Assistant</p>
        </div>
        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav - Hidden on Desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around z-50 pb-safe">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] mt-1 font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}