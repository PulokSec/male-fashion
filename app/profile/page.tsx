import { redirect } from "next/navigation"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfileOrders } from "@/components/profile/profile-orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getServerUser } from "@/lib/auth"

export default async function ProfilePage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Suspense fallback={<ProfileInfoSkeleton />}>
            <ProfileInfo userId={user.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Suspense fallback={<ProfileOrdersSkeleton />}>
            <ProfileOrders userId={user.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileInfoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

function ProfileOrdersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
