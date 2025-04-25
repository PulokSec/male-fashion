import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-64 rounded-md" />
      <Skeleton className="w-2/3 h-4 rounded-md" />
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-full" />
        ))}
      </div>
      <Skeleton className="w-1/3 h-4 rounded-md" />
    </div>
  )
}
