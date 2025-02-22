import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProjectForm } from '@/components/projects/project-form'
import { redirect } from 'next/navigation'

export default async function NewProjectPage() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      redirect('/auth')
    }

    // Verify user is an entrepreneur
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'entrepreneur') {
      redirect('/auth/entrepreneur')
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
          <ProjectForm userId={session.user.id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in new project page:', error)
    redirect('/auth')
  }
}
