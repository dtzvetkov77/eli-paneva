import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { readBlogPost } from '@/lib/supabase-store'
import PostEditClient from './PostEditClient'

interface Props { params: Promise<{ id: string }> }

export default async function AdminBlogPostPage({ params }: Props) {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const { id } = await params
  const post = await readBlogPost(id)
  if (!post) redirect('/admin/blog')
  return <PostEditClient post={post} />
}
