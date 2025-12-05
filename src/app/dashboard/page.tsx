'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (!res.data?.user) router.push('/login')
      else setUser(res.data.user)
    })
  }, [router])

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setMessage('Uploading & analyzing…')

    try {
      const fileName = `${user.id}/${Date.now()}_${file.name}`
      const { error: upErr } = await supabase.storage
        .from('uploads')
        .upload(fileName, file)

      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)

      const { error: rpcErr } = await supabase.rpc('insert_report_with_file', {
        p_user_id: user.id,
        p_title: file.name,
        p_file_url: publicUrl,
        p_original_name: file.name,
        p_file_type: file.type
      })

      if (rpcErr) throw rpcErr

      setMessage('Success! AI is generating your perfect FAA report… Check back in 30 seconds.')
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  if (!user) return <div className="text-center pt-40 text-2xl">Loading…</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">FAA Report Generator</h1>
        <p className="text-2xl mb-12">Welcome back, <strong>{user.email}</strong> ✈️</p>

        <div className="border-4 border-dashed border-indigo-500 rounded-3xl p-32 bg-indigo-50 hover:bg-indigo-100 transition">
          <input
            type="file"
            accept=".pdf,.jpg,.png,.mp3,.wav,.m4a"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-lg file:mr-6 file:py-6 file:px-12 file:rounded-full file:border-0 file:text-white file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600"
          />
          <p className="mt-10 text-3xl font-bold text-gray-800">
            {uploading ? 'AI is working…' : 'Drop inspection notes here'}
          </p>
        </div>

        {message && (
          <div className={`mt-12 p-8 rounded-2xl text-2xl font-bold ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}