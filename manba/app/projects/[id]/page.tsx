import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type Pledge = Database['public']['Tables']['pledges']['Row']

export default async function ProjectPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()

  // Fetch project details and pledges
  const [projectResult, pledgesResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single<Project>(),
    supabase
      .from('pledges')
      .select('*')
      .eq('project_id', id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .returns<Pledge[]>()
  ])

  const project = projectResult.data
  const pledges = pledgesResult.data || []

  if (!project) {
    notFound()
  }

  // Calculate stats
  const totalPledges = pledges.length
  const recentPledges = pledges.slice(0, 5)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {project.short_description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Images */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {project.images?.[0] && (
                  <div className="relative aspect-video">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {project.images && project.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {project.images.slice(1).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-video">
                        <Image
                          src={image}
                          alt={`${project.title} ${index + 2}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Section */}
              {project.video_url && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Project Video</h2>
                  <div className="relative aspect-video">
                    <iframe
                      src={project.video_url}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Project Description */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">About the Project</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {project.description}
                </div>
              </div>

              {/* Recent Supporters */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Supporters</h2>
                {recentPledges.length > 0 ? (
                  <div className="space-y-4">
                    {recentPledges.map((pledge) => (
                      <div key={pledge.id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <p className="font-medium">
                            {pledge.anonymous ? 'Anonymous Supporter' : pledge.name}
                          </p>
                          {pledge.message && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              "{pledge.message}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${pledge.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(pledge.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Be the first to support this project!</p>
                )}
              </div>

              {/* Creator Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">About the Creator</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {project.location[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Project Creator</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      From {project.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    ${project.current_amount.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    pledged of ${project.funding_goal.toLocaleString()} goal
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (project.current_amount / project.funding_goal) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Total Supporters</span>
                      <span className="font-medium">{totalPledges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining</span>
                      <span className="font-medium">30</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/projects/${project.id}/support`}
                  className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Support this Project
                </Link>

                <p className="mt-4 text-sm text-gray-500 text-center">
                  No account needed. Support projects directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
