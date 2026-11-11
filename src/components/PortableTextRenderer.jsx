export default function PortableTextRenderer({ content, className = '' }) {
  if (!content) return null

  // Case 1: Array of Portable Text blocks or strings
  if (Array.isArray(content)) {
    return (
      <div className={`portable-text-body ${className}`}>
        {content.map((item, idx) => {
          // If it's a raw string
          if (typeof item === 'string') {
            return <p key={idx}>{item}</p>
          }

          // If it's a Portable Text block object
          if (item && item._type === 'block') {
            const style = item.style || 'normal'
            const textContent = (item.children || [])
              .map((child) => child.text || '')
              .join('')

            if (!textContent.trim()) {
              return <div key={idx} className="block-empty-line" style={{ height: '1.2em' }} />
            }

            const renderedChildren = (item.children || []).map((child, cIdx) => {
              let node = child.text
              const marks = child.marks || []

              if (marks.includes('strong')) node = <strong key={cIdx}>{node}</strong>
              if (marks.includes('em')) node = <em key={cIdx}>{node}</em>
              if (marks.includes('underline')) node = <u key={cIdx}>{node}</u>

              return <span key={cIdx}>{node}</span>
            })

            if (style === 'h1') return <h1 key={idx}>{renderedChildren}</h1>
            if (style === 'h2') return <h2 key={idx}>{renderedChildren}</h2>
            if (style === 'h3') return <h3 key={idx}>{renderedChildren}</h3>
            if (style === 'h4') return <h4 key={idx}>{renderedChildren}</h4>
            if (style === 'blockquote') return <blockquote key={idx}>{renderedChildren}</blockquote>

            return <p key={idx}>{renderedChildren}</p>
          }

          // Fallback if item is an object with text
          if (item && item.text) {
            return <p key={idx}>{item.text}</p>
          }

          return null
        })}
      </div>
    )
  }

  // Case 2: Plain text string
  if (typeof content === 'string') {
    const paragraphs = content.split(/\n\s*\n/)
    return (
      <div className={`portable-text-body ${className}`}>
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para.trim()}</p>
        ))}
      </div>
    )
  }

  return null
}

