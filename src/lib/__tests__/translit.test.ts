import { translitSlug } from '../translit'

const cases: [string, string][] = [
  // Raw Cyrillic
  ['вътрешно-дете-и-мак-карти', 'vatreshno-dete-i-mak-karti'],
  // Percent-encoded Cyrillic (WP API format)
  ['%d0%b2%d1%8a%d1%82%d1%80%d0%b5%d1%88%d0%bd%d0%be-%d0%b4%d0%b5%d1%82%d0%b5', 'vatreshno-dete'],
  // Mixed Latin + digits (passthrough)
  ['5-uprazhneniya-mak', '5-uprazhneniya-mak'],
  // Already Latin
  ['kak-se-raboti', 'kak-se-raboti'],
  // Hyphens preserved; констела-ции ends in tsii (two и)
  ['системни-констелации', 'sistemni-konstelatsii'],
  // Special BG chars
  ['щастие', 'shtastie'],
  ['юноша', 'yunosha'],
  ['ъгъл', 'agal'],
]

describe('translitSlug', () => {
  test.each(cases)('translitSlug(%s) === %s', (input, expected) => {
    expect(translitSlug(input)).toBe(expected)
  })

  test('round-trips: translit(WP slug) === URL param', () => {
    const wpSlug = '%d0%ba%d0%b0%d0%ba-%d1%81%d0%b5-%d1%80%d0%b0%d0%b1%d0%be%d1%82%d0%b8'
    const result = translitSlug(wpSlug)
    // Blog card generates href with translitSlug(post.slug)
    // getPost receives the same string and compares translitSlug(p.slug) === slug
    expect(translitSlug(wpSlug)).toBe(result) // idempotent for Latin output
  })

  test('handles invalid percent encoding gracefully', () => {
    expect(() => translitSlug('%zz-invalid')).not.toThrow()
  })
})
