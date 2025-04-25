"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProductImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  buttonText?: string
}

export default function ProductImageUpload({
  onImageUploaded,
  currentImage,
  buttonText = "Upload Image",
}: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setIsUploading(true)
    setUploadProgress(0)
    setError("")

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, or WebP image.")
      setIsUploading(false)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.")
      setIsUploading(false)
      return
    }

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload image")
      }

      setUploadProgress(100)

      const data = await response.json()
      onImageUploaded(data.url)

      // Reset upload state after a short delay
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {currentImage && (
        <div className="relative group">
          <img src={currentImage || "/placeholder.svg"} alt="Product" className="w-full h-48 object-cover rounded-md" />
          <button
            onClick={() => onImageUploaded("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{buttonText}</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 5MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  )
}
