import { createServerSupabaseClient } from '@/lib/supabase-server'
import SupportForm from './support-form'
import { redirect } from 'next/navigation'

export default async function SupportPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()

  // Verify project exists
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (error || !project) {
    redirect('/projects')
  }

  return <SupportForm projectId={project.id} />
}
