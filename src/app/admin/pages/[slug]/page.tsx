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

const FIELD_DEFAULTS: Record<string, Record<string, string>> = {
  home: {
    hero_title: 'Намерете мира.\nНамерете себе си.',
    hero_subtitle: 'Подкрепям хората в процеса на вътрешна промяна чрез системни констелации, PSYCH-K®, енергийна психология и МАК карти.',
    hero_cta: 'Запази час',
  },
  'za-men': {
    hero_title: 'Ели Панева',
    bio_paragraph_1: 'Аз съм холистичен консултант, трансформационен коуч и автор.',
    bio_paragraph_2: 'Работя с хора от всички сфери на живота.',
    story_paragraph_1: '',
    story_paragraph_2: '',
    story_paragraph_3: '',
    story_paragraph_4: '',
  },
  kontakti: {
    intro: 'Запази своята консултация или задай въпрос. Отговарям в рамките на 24 часа в работни дни.',
  },
  cta_section: {
    title: 'Направете първата стъпка\nкъм живота, който заслужавате',
    subtitle: 'Над 500 клиенти са си върнали увереността, подобрили са отношенията си и са открили вътрешен мир.',
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

  const defaults = FIELD_DEFAULTS[slug] ?? {}
  const saved = allContent[slug] ?? {}
  const pageContent = { ...defaults, ...saved }
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
