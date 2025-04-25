import type React from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { getServerUser } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if setup is needed first
  try {
    const setupResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || ""}/api/setup`)
    const setupData = await setupResponse.json()
    if (setupData.needsSetup) {
      redirect("/admin/setup")
    }
  } catch (error) {
    console.error("Error checking setup status:", error)
    // Continue to auth check, which will handle redirects if needed
  }

  // Check authentication
  const user = await getServerUser()

  // If not authenticated, redirect to login
  if (user && !user?.isAdmin) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4">{children}</div>
      </div>
    </div>
  )
}
