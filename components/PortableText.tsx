import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

type Span = { _key?: string; _type?: string; text?: string; marks?: string[] }
type MarkDef = { _key: string; _type: string; href?: string }

export type Block = {
  _key?: string
  _type?: string
  style?: string
  listItem?: string
  level?: number
  children?: Span[]
  markDefs?: MarkDef[]
  asset?: unknown
  alt?: string
}

/** Flatten Portable Text to a plain string — for excerpts, meta tags, card copy. */
export function toPlainText(blocks?: Block[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter(block => block?._type === 'block' && Array.isArray(block.children))
    .map(block => (block.children ?? []).map(span => span?.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function Spans({ spans, markDefs }: { spans?: Span[]; markDefs?: MarkDef[] }) {
  return (
    <>
      {(spans ?? []).map((span, index) => {
        const marks = span.marks ?? []
        let node: React.ReactNode = span.text ?? ''

        if (marks.includes('strong')) node = <strong className="font-semibold text-primary-900">{node}</strong>
        if (marks.includes('em')) node = <em>{node}</em>
        if (marks.includes('underline')) node = <u>{node}</u>

        // Any remaining mark that resolves to a link definition
        const linkDef = marks
          .map(mark => (markDefs ?? []).find(def => def._key === mark))
          .find(def => def?._type === 'link' && def.href)

        if (linkDef?.href) {
          node = (
            <a
              href={linkDef.href}
              className="font-medium text-primary-700 underline underline-offset-2 transition-colors hover:text-gold-600"
              rel="noopener noreferrer"
              target={linkDef.href.startsWith('http') ? '_blank' : undefined}
            >
              {node}
            </a>
          )
        }

        return <span key={span._key ?? index}>{node}</span>
      })}
    </>
  )
}

/**
 * Minimal Portable Text renderer covering what the DOBS schemas actually allow:
 * paragraphs, headings, blockquotes, bullet/numbered lists and inline images.
 * Kept in-repo rather than pulling in @portabletext/react for this much.
 */
export default function PortableText({ value }: { value?: Block[] }) {
  if (!Array.isArray(value) || value.length === 0) return null

  const nodes: React.ReactNode[] = []
  let list: { type: string; items: Block[] } | null = null

  const flushList = () => {
    if (!list) return
    const ListTag = list.type === 'number' ? 'ol' : 'ul'
    nodes.push(
      <ListTag
        key={`list-${nodes.length}`}
        className={`my-5 space-y-2 pl-6 ${list.type === 'number' ? 'list-decimal' : 'list-disc'} marker:text-primary-600`}
      >
        {list.items.map((item, index) => (
          <li key={item._key ?? index} className="leading-7 text-gray-700">
            <Spans spans={item.children} markDefs={item.markDefs} />
          </li>
        ))}
      </ListTag>,
    )
    list = null
  }

  value.forEach((block, index) => {
    const key = block._key ?? `block-${index}`

    if (block._type === 'image' && block.asset) {
      flushList()
      const src = urlFor(block).width(1400).url()
      nodes.push(
        <figure key={key} className="my-8 overflow-hidden rounded-2xl border border-parchment-200 shadow-card">
          <Image src={src} alt={block.alt ?? ''} width={1400} height={900} className="h-auto w-full object-cover" />
          {block.alt && <figcaption className="bg-parchment-50 px-4 py-3 text-sm text-gray-600">{block.alt}</figcaption>}
        </figure>,
      )
      return
    }

    if (block._type !== 'block') return

    if (block.listItem) {
      if (list && list.type !== block.listItem) flushList()
      list = list ?? { type: block.listItem, items: [] }
      list.items.push(block)
      return
    }

    flushList()

    const content = <Spans spans={block.children} markDefs={block.markDefs} />

    switch (block.style) {
      case 'h1':
      case 'h2':
        nodes.push(<h2 key={key} className="mt-10 font-diocesan text-3xl font-bold text-primary-800">{content}</h2>)
        break
      case 'h3':
        nodes.push(<h3 key={key} className="mt-8 font-diocesan text-2xl font-bold text-primary-800">{content}</h3>)
        break
      case 'h4':
        nodes.push(<h4 key={key} className="mt-6 text-lg font-semibold text-primary-800">{content}</h4>)
        break
      case 'blockquote':
        nodes.push(
          <blockquote key={key} className="my-6 border-l-4 border-gold-500 bg-parchment-50 py-3 pl-5 pr-4 italic leading-7 text-primary-800">
            {content}
          </blockquote>,
        )
        break
      default:
        nodes.push(<p key={key} className="leading-7 text-gray-700">{content}</p>)
    }
  })

  flushList()

  return <div className="space-y-5">{nodes}</div>
}
