import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NutritionTracker } from '@/components/nutrition-tracker'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <NutritionTracker />
}