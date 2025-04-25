"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dbInfo, setDbInfo] = useState({
    connectionString: "",
    databaseName: "",
    isConnected: false,
  })

  useEffect(() => {
    const fetchDbInfo = async () => {
      try {
        const response = await fetch("/api/settings/database")
        if (response.ok) {
          const data = await response.json()
          setDbInfo({
            connectionString: data.connectionString || "",
            databaseName: data.databaseName || "",
            isConnected: data.isConnected,
          })
        }
      } catch (error) {
        console.error("Error fetching database info:", error)
      }
    }

    fetchDbInfo()
  }, [])

  const handleDbInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDbInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveDbInfo = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/settings/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionString: dbInfo.connectionString,
          databaseName: dbInfo.databaseName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update database settings")
      }

      setSuccess("Database settings updated successfully. Please restart the application for changes to take effect.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="database">
        <TabsList>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>
                Configure your MongoDB connection. Changes will require an application restart.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="connectionString">MongoDB Connection String</Label>
                  <Input
                    id="connectionString"
                    name="connectionString"
                    value={dbInfo.connectionString}
                    onChange={handleDbInfoChange}
                    placeholder="mongodb://username:password@host:port"
                    type="password"
                  />
                  <p className="text-sm text-gray-500">This will update the MONGODB_URI environment variable.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="databaseName">Database Name (Optional)</Label>
                  <Input
                    id="databaseName"
                    name="databaseName"
                    value={dbInfo.databaseName}
                    onChange={handleDbInfoChange}
                    placeholder="my-ecommerce-db"
                  />
                  <p className="text-sm text-gray-500">
                    If provided, this will override the database name in the connection string.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${dbInfo.isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className="text-sm">
                    {dbInfo.isConnected ? "Connected to database" : "Not connected to database"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveDbInfo} disabled={loading}>
                {loading ? "Saving..." : "Save Database Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your admin account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Account settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure your store settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Store settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
