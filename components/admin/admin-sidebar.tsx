"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Tag, Percent, Users, Settings, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "../ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { signout } = useAuth()
  console.log(pathname);
  const handleSignout = async () => {
    await signout()
    router.push("/admin/login")
  }
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <Tag size={20} />,
    },
    {
      title: "Deals",
      href: "/admin/deals",
      icon: <Percent size={20} />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ]

  return (
    <>
    {/* Mobile menu button */}
    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 right-4 z-50" onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </Button>
       {/* Sidebar */}
       <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full", pathname === "/admin/login" ? "hidden" : "block"
        )}
      >
    <div className="w-64 bg-white shadow-md h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Male fashion<span className="text-red-500">.</span> Admin</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                pathname === item.href ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={handleSignout}
          className="flex items-center px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 w-full"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
    </aside>
    {/* Overlay for mobile */}
    {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
