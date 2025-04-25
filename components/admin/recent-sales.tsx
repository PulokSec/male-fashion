"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type RecentSale = {
  _id: string
  user: {
    name: string
    email: string
  }
  totalAmount: number
  createdAt: string
}

export function RecentSales() {
  const [sales, setSales] = useState<RecentSale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        const response = await fetch("/api/stats/recent-sales")
        if (!response.ok) {
          throw new Error("Failed to fetch recent sales")
        }
        const data = await response.json()
        setSales(data)
      } catch (err) {
        console.error("Error fetching recent sales:", err)
        setError("Failed to load recent sales")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentSales()
  }, [])

  if (loading) {
    return <div>Loading recent sales...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (sales.length === 0) {
    return <div className="text-muted-foreground">No recent sales found</div>
  }

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {sale.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.user.name}</p>
            <p className="text-sm text-muted-foreground">{sale.user.email}</p>
          </div>
          <div className="ml-auto font-medium">+${sale.totalAmount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
