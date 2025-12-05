// src/lib/supabaseClient.ts
// Use this client ONLY in Client Components that have 'use client' at the top.

import { createBrowserClient } from '@supabase/ssr'

// We export a function instead of a constant. This prevents the code from
// executing during Vercel's static build phase, which fixes the deployment error.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )