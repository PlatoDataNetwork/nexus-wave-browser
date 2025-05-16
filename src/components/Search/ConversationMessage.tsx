
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clock, Globe, LineChart } from 'lucide-react';
import StockComparisonChart from './StockComparisonChart';

interface Source {
  title: string;
  url: string;
}

interface ChartData {
  type: 'stockComparison';
  symbols: string[];
  data: Array<{
    date: string;
    [key: string]: string | number;
  }>;
  title: string;
}

interface ConversationMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  hasRealTimeData?: boolean;
  chartData?: ChartData;
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
  sources,
  hasRealTimeData,
  chartData
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
            {hasRealTimeData && (
              <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
                <Globe className="h-3 w-3" />
                <span>Enhanced with real-time web data</span>
              </div>
            )}
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
            
            {/* Display chart if available */}
            {chartData && chartData.type === 'stockComparison' && (
              <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs font-medium mb-2">
                  <LineChart className="h-3 w-3" />
                  <span>Stock Price Comparison Chart:</span>
                </div>
                <StockComparisonChart 
                  data={chartData.data}
                  symbols={chartData.symbols}
                  title={chartData.title}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        )}
        
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs font-medium mb-1">
              <Clock className="h-3 w-3" />
              <span>Sources:</span>
            </div>
            <ul className="space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-xs">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-nexus-purple underline hover:text-nexus-deep-purple">
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
