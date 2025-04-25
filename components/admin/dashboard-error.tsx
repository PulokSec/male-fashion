import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardError({ error }: { error: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>

      <div className="flex justify-center mt-4">
        <Link href="/admin/settings">
          <Button variant="outline">Check Database Settings</Button>
        </Link>
      </div>
    </div>
  )
}
