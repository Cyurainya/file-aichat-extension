import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import 'highlight.js/styles/atom-one-dark.css'
export function MarkdownBox(props: { content: string }) {
  const { content } = props
  return (
    <ReactMarkdown
      className='prose prose-zinc max-w-none dark:prose-invert'
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  )
}
