"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/database.types"

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectListProps {
  initialProjects: Project[]
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleStatusChange = async (projectId: string, newStatus: Project['status']) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId)

      if (error) throw error

      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, status: newStatus }
          : project
      ))
    } catch (error) {
      console.error('Error updating project status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You haven&apos;t created any projects yet.
        </p>
        <Link href="/projects/new">
          <Button>Create Your First Project</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Link href="/projects/new">
          <Button>Create New Project</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.short_description}
                </p>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Goal: ${project.funding_goal.toLocaleString()}</span>
                  <span>Raised: ${project.current_amount.toLocaleString()}</span>
                  <span className="capitalize">Status: {project.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {project.status === 'draft' && (
                  <Button
                    onClick={() => handleStatusChange(project.id, 'active')}
                    disabled={isLoading}
                    className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Publish
                  </Button>
                )}
                {project.status === 'active' && (
                  <Button
                    onClick={() => handleStatusChange(project.id, 'delisted')}
                    disabled={isLoading}
                    className="bg-transparent border border-gray-300 text-red-600 hover:text-red-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Delist
                  </Button>
                )}
                {project.status === 'delisted' && (
                  <Button
                    onClick={() => handleStatusChange(project.id, 'active')}
                    disabled={isLoading}
                    className="bg-transparent border border-gray-300 text-green-600 hover:text-green-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Republish
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
