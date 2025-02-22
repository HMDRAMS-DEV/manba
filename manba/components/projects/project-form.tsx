"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface ProjectFormProps {
  userId: string
}

export function ProjectForm({ userId }: ProjectFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    // Log auth state on mount
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      console.log('Expected userId:', userId)
      if (user?.id !== userId) {
        console.error('User ID mismatch')
      }
    }
    checkAuth()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setUploadedImages(prev => [...prev, ...newFiles])

    // Create preview URLs
    const urls = newFiles.map(file => URL.createObjectURL(file))
    setImageUrls(prev => [...prev, ...urls])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const shortDescription = formData.get('shortDescription') as string
    const fundingGoal = parseFloat(formData.get('fundingGoal') as string)
    const location = formData.get('location') as string
    const category = formData.get('category') as string
    const videoUrl = formData.get('videoUrl') as string || null

    try {
      // Double check auth before proceeding
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Not authenticated')
      }
      if (user.id !== userId) {
        throw new Error('User ID mismatch')
      }

      // Log the project data we're trying to insert
      console.log('Attempting to create project with:', {
        title,
        description,
        shortDescription,
        fundingGoal,
        location,
        category,
        videoUrl,
        userId: user.id
      })

      // Upload images to storage
      const imagePromises = uploadedImages.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        console.log('Attempting to upload image:', filePath)

        const { error: uploadError, data } = await supabase.storage
          .from('project-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath)

        return publicUrl
      })

      const uploadedImageUrls = await Promise.all(imagePromises)
      console.log('Successfully uploaded images:', uploadedImageUrls)

      // Create project in database
      const { error: dbError, data: project } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          short_description: shortDescription,
          funding_goal: fundingGoal,
          current_amount: 0,
          status: 'active',
          images: uploadedImageUrls,
          user_id: user.id,
          video_url: videoUrl,
          location,
          category,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`Failed to create project: ${dbError.message}`)
      }

      console.log('Successfully created project:', project)

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter your project title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          required
          placeholder="Brief description of your project"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <textarea
          id="description"
          name="description"
          required
          className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Detailed description of your project"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
        <Input
          id="fundingGoal"
          name="fundingGoal"
          type="number"
          min="1"
          step="0.01"
          required
          placeholder="Enter funding goal amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          required
          placeholder="Project location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a category</option>
          <option value="technology">Technology</option>
          <option value="food">Food & Beverage</option>
          <option value="retail">Retail</option>
          <option value="services">Services</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (Optional)</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          placeholder="Link to your project video"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Project Images</Label>
        <Input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          required
        />
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-video">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating Project..." : "Create Project"}
      </Button>
    </form>
  )
}
