"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Inbox, Mail } from "lucide-react"
import { format } from "date-fns"

export default function ContactsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  interface Contact {
    _id: string
    name: string
    email: string
    subject: string
    status: string
    createdAt: string
  }

  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      if (filters.status) {
        queryParams.append("status", filters.status)
      }

      if (filters.search) {
        queryParams.append("search", filters.search)
      }

      const response = await fetch(`/api/contacts?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch contacts")
      }

      const data = await response.json()
      setContacts(data.contacts)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [pagination.page, filters])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSearchChange = (e: { target: { value: any } }) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  const handleSearchSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchContacts()
  }

  const handleSortChange = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>
      case "read":
        return <Badge variant="secondary">Read</Badge>
      case "replied":
        return <Badge variant="default">Replied</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Contacts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>Manage customer inquiries and messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </form>
            </div>
            <div className="w-full md:w-48">
              <Select value={filters.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("name")}>
                    Name
                    {filters.sortBy === "name" && (
                      <span className="ml-1">{filters.sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("subject")}>
                    Subject
                    {filters.sortBy === "subject" && (
                      <span className="ml-1">{filters.sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("createdAt")}>
                    Date
                    {filters.sortBy === "createdAt" && (
                      <span className="ml-1">{filters.sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading contacts...</p>
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p>No contacts found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {filters.search || filters.status
                          ? "Try adjusting your filters"
                          : "Customer messages will appear here"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow
                      key={contact._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/admin/contacts/${contact._id}`)}
                    >
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{contact.subject}</TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell>{format(new Date(contact.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/contacts/${contact._id}`)
                          }}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {pagination.page === 1 ? (
                      <PaginationPrevious className="opacity-50 pointer-events-none" />
                    ) : (
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      />
                    )}
                  </PaginationItem>

                  {Array.from({ length: pagination.pages }).map((_, i) => {
                    const page = i + 1

                    // Show first page, last page, and pages around current page
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink isActive={page === pagination.page} onClick={() => handlePageChange(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }

                    // Show ellipsis for gaps
                    if (page === 2 || page === pagination.pages - 1) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    return null
                  })}

                  <PaginationItem>
                    {pagination.page === pagination.pages ? (
                      <PaginationNext className="opacity-50 pointer-events-none" />
                    ) : (
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
