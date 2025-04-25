"use client"

import DashboardError from "@/components/admin/dashboard-error"

export default function Error({ error }: { error: Error }) {
  return <DashboardError error={error.message || "An unexpected error occurred"} />
}
