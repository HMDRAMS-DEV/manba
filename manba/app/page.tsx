import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/database.types'

type Project = Database['public']['Tables']['projects']['Row']

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // Fetch active projects
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .returns<Project[]>()

  console.log('Projects:', projects) // Debug log
  console.log('Error:', error) // Debug log

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/sun.svg"
            alt="Decorative sun"
            width={600}
            height={600}
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Empowering Syrian Entrepreneurs Through Community Support
            </h1>
            <p className="text-2xl md:text-3xl mb-8" lang="ar">
              منصة تمويل جماعي لدعم رواد الأعمال السوريين
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join our community in supporting small businesses and entrepreneurs in Syria. 
              Every contribution helps build a stronger economic future.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        {error ? (
          <div className="text-center text-red-600">
            Error loading projects. Please try again later.
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.short_description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Goal: ${project.funding_goal.toLocaleString()}
                    </div>
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No active projects at the moment. Check back soon!
          </div>
        )}
      </div>
    </div>
  )
}
