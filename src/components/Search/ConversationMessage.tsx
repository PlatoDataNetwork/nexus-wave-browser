
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Source {
  title: string;
  url: string;
}

interface ConversationMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

// Define a proper type for the code component props
interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const ConversationMessage: React.FC<ConversationMessageProps> = ({ 
  role, 
  content, 
  sources 
}) => {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 rounded-lg p-4 ${
          role === "user"
            ? "bg-nexus-purple text-white"
            : "bg-secondary border border-border"
        }`}
      >
        {role === "user" ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="conversation-markdown">
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
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
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium mb-1">Sources:</p>
            <ul className="space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-xs">
                  <a href={source.url} className="text-nexus-purple underline hover:text-nexus-deep-purple">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationMessage;
