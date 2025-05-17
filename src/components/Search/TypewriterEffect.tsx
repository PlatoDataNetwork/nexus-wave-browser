
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TypewriterEffectProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
}

// Define proper types for the code component props
interface CodeProps {
  node?: any;
  className?: string;
  children: React.ReactNode;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  isStreaming = false,
  className = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className={className}>
      <ReactMarkdown
        components={{
          code: ({ className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={atomDark}
                PreTag="div"
                className="rounded-md my-2"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            )
          },
          p: ({children}) => <p className="mb-2">{children}</p>,
          ul: ({children}) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal ml-6 mb-3">{children}</ol>,
          li: ({children}) => <li className="mb-1">{children}</li>,
          h1: ({children}) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
          h3: ({children}) => <h3 className="text-md font-bold mb-2">{children}</h3>,
          a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-nexus-purple underline hover:text-nexus-deep-purple">{children}</a>,
          img: ({src, alt}) => <img src={src} alt={alt || ''} className="max-w-full h-auto rounded-md my-2" />
        }}
      >
        {text}
      </ReactMarkdown>
      
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-nexus-purple animate-pulse" />
      )}
    </div>
  );
};

export default TypewriterEffect;
