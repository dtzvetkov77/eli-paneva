import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import PostEditClient from '../[id]/PostEditClient'
import type { BlogPost } from '@/lib/blog'

const emptyPost: BlogPost = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  date: new Date().toISOString(),
  coverImage: '',
  published: false,
}

export default async function NewBlogPostPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  return <PostEditClient post={emptyPost} isNew />
}
