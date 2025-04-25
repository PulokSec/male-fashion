import { redirect } from "next/navigation"

export default function AdminIndexPage() {
  // Redirect to dashboard
  redirect("/admin/dashboard")
}
