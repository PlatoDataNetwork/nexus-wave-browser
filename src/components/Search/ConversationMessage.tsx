
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clock, Globe, BarChart2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Source {
  title: string;
  url: string;
}

interface ChartData {
  type: string;
  data: Array<Record<string, any>>;
  title: string;
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: Record<string, string>;
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

const ChartVisualization: React.FC<{ chartData: ChartData }> = ({ chartData }) => {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return null;
  }

  // Create color configuration for the chart
  const chartConfig: Record<string, any> = {};
  
  // Set colors for each data series in the chart
  chartData.yAxisKeys.forEach((key, index) => {
    // Default colors if not provided
    const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
    const color = chartData.colors?.[key] || defaultColors[index % defaultColors.length];
    
    chartConfig[key] = {
      label: key,
      theme: {
        light: color,
        dark: color
      }
    };
  });

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart2 className="h-4 w-4 text-nexus-purple" />
        <h3 className="font-medium text-sm">{chartData.title}</h3>
      </div>
      <div className="h-80 w-full border rounded-lg p-4">
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={chartData.xAxisKey} 
              fontSize={12}
              tick={{ fill: 'var(--foreground)' }}
            />
            <YAxis fontSize={12} tick={{ fill: 'var(--foreground)' }} />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                />
              )}
            />
            <Legend content={(props) => <ChartLegendContent {...props} />} />
            {chartData.yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                dot={{ strokeWidth: 2, r: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

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
                img: ({src, alt}) => <img src={src} alt={alt || ''} className="max-w-full h-auto rounded-md my-2" />
              }}
            >
              {content}
            </ReactMarkdown>
            
            {chartData && <ChartVisualization chartData={chartData} />}
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
