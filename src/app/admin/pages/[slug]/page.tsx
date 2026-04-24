import { isAuthenticated } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'
import PageEditor from './PageEditor'

const PAGE_LABELS: Record<string, string> = {
  home: 'Начална страница',
  'za-men': 'За мен',
  kontakti: 'Контакти',
  cta_section: 'CTA секция',
}

const FIELD_LABELS: Record<string, Record<string, string>> = {
  home: {
    hero_title: 'Заглавие на Hero секцията',
    hero_subtitle: 'Подзаглавие на Hero секцията',
    hero_cta: 'Текст на бутона',
  },
  'za-men': {
    hero_title: 'Заглавие',
    bio_paragraph_1: 'Биография — параграф 1',
    bio_paragraph_2: 'Биография — параграф 2',
    story_paragraph_1: 'История — параграф 1',
    story_paragraph_2: 'История — параграф 2',
    story_paragraph_3: 'История — параграф 3',
    story_paragraph_4: 'История — параграф 4',
  },
  kontakti: {
    intro: 'Уводен текст',
  },
  cta_section: {
    title: 'Заглавие',
    subtitle: 'Подзаглавие',
  },
}

interface Props { params: Promise<{ slug: string }> }

export default async function PageEditorPage({ params }: Props) {
  if (!(await isAuthenticated())) redirect('/admin/login')

  const { slug } = await params
  if (!PAGE_LABELS[slug]) notFound()

  const contentFile = join(process.cwd(), 'src', 'data', 'site-content.json')
  let allContent: Record<string, Record<string, string>> = {}
  try {
    allContent = JSON.parse(await readFile(contentFile, 'utf-8'))
  } catch { /* empty */ }

  const pageContent = allContent[slug] ?? {}
  const fields = FIELD_LABELS[slug] ?? {}

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/pages" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Назад</a>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">{PAGE_LABELS[slug]}</h1>
      </div>
      <PageEditor slug={slug} fields={fields} initialContent={pageContent} />
    </div>
  )
}
