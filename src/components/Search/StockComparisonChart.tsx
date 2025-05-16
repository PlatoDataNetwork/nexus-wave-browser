
import React from 'react';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

export interface StockDataPoint {
  date: string;
  [key: string]: string | number; // For stock prices by symbol
}

interface StockComparisonChartProps {
  data: StockDataPoint[];
  symbols: string[];
  title: string;
  className?: string;
}

const StockComparisonChart: React.FC<StockComparisonChartProps> = ({ 
  data, 
  symbols, 
  title,
  className 
}) => {
  // Generate random colors for each stock symbol
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Prepare stock symbol colors
  const symbolColors = symbols.reduce((acc, symbol) => {
    acc[symbol] = getRandomColor();
    return acc;
  }, {} as Record<string, string>);

  // Format timestamps to readable dates
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString()
  }));

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-md font-medium mb-2">{title}</h3>
      <div className="h-80 w-full">
        <ChartContainer
          config={{
            ...symbolColors,
            theme: {
              dark: "hsl(240 10% 3.9%)",
            },
          }}
        >
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={10}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              width={50}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 10 }}
            />
            {symbols.map(symbol => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={symbolColors[symbol]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name={symbol}
              />
            ))}
            <Legend />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => [`$${value}`, name]}
                />
              }
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default StockComparisonChart;
