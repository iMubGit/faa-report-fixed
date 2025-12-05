'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Change import from the constant 'supabase' to the function 'createClient'
import { createClient } from '@/lib/supabaseClient' 

export default function Dashboard() {
  // FIX: Ensure the client instance is created HERE, inside the component function.
  // This makes sure it doesn't run during static compilation.
  const supabase = createClient() 

  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  // ... rest of your code ...
  
  // (All the rest of the code is unchanged from the last successful update)

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (!res.data?.user) router.push('/login')
      else setUser(res.data.user)
    })
  }, [router, supabase.auth]) // FIX: Added supabase.auth to the dependency array to clear the hook warning.

  // ... rest of your handleUpload and return statements ...
}