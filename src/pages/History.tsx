import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Globe, 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  X 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import PageLayout from "@/components/Layout/PageLayout";

// Mock history data - in a real app, this would come from persistent storage
const mockHistoryData = [
  {
    id: "hist-1",
    title: "tmrw.io - Web3 Analytics Platform",
    url: "https://tmrw.io/analytics",
    favicon: "/favicon.ico",
    timestamp: new Date().getTime() - 1000 * 60 * 5, // 5 minutes ago
    type: "webpage"
  },
  {
    id: "hist-2",
    title: "Nexus Wave Browser Documentation",
    url: "/documentation",
    favicon: "/favicon.ico",
    timestamp: new Date().getTime() - 1000 * 60 * 30, // 30 minutes ago
    type: "internal"
  },
  {
    id: "hist-3",
    title: "Nexus Wave Extension Store",
    url: "/extension-store",
    favicon: "/favicon.ico",
    timestamp: new Date().getTime() - 1000 * 60 * 60, // 1 hour ago
    type: "internal"
  },
  {
    id: "hist-4",
    title: "DeFi Protocol Analytics - Platodata",
    url: "https://platodata.io/defi-protocols",
    favicon: "/favicon.ico",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 3, // 3 hours ago
    type: "webpage"
  },
  {
    id: "hist-5",
    title: "Ethereum Foundation - Cryptocurrency Research",
    url: "https://ethereum.org/research",
    favicon: "/favicon.ico",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, // 1 day ago
    type: "webpage"
  },
  {
    id: "hist-6",
    title: "NFT Marketplace Trends - Web3 Analysis",
    url: "https://platodata.io/nft-trends",
    favicon: "/favicon.ico",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 48, // 2 days ago
    type: "webpage"
  }
];

const HistoryPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [historyItems, setHistoryItems] = useState(mockHistoryData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredItems = mockHistoryData.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setHistoryItems(filteredItems);
    
    if (filteredItems.length === 0) {
      toast({
        title: "No results found",
        description: "Try a different search term"
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setHistoryItems(mockHistoryData);
  };

  const clearHistory = () => {
    toast({
      title: "History cleared",
      description: "Your browsing history has been deleted"
    });
    setHistoryItems([]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The history item has been deleted"
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    
    // Today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    }
    
    // Within this week
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(date, 'EEEE, h:mm a');
    }
    
    // Older
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  // Group history items by date
  const groupedHistory = historyItems.reduce((acc, item) => {
    const date = new Date(item.timestamp);
    const dateString = date.toDateString();
    
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(item);
    return acc;
  }, {} as Record<string, typeof historyItems>);

  return (
    <div className="h-full w-full overflow-auto">
      <div className="flex flex-col h-full pb-16">
        <Card className="nexus-glass animate-pulse-glow border-none shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="flex items-center">
                  <span className="text-[#3949AB] mr-2">Nexus Wave V2.1</span>
                  <HistoryIcon className="h-6 w-6" />
                  <span className="ml-1">Browser History</span>
                </div>
              </CardTitle>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={clearHistory}
              >
                <Trash2 className="h-4 w-4" />
                Clear All History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All History</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                <TabsTrigger value="older">Older</TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search history"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>

              <TabsContent value="all" className="space-y-4">
                <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                  {Object.keys(groupedHistory).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <HistoryIcon className="h-12 w-12 mb-2 opacity-50" />
                      <h3 className="text-lg font-medium">No history found</h3>
                      <p className="text-sm">Your browsing history will appear here</p>
                    </div>
                  ) : (
                    Object.entries(groupedHistory)
                      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                      .map(([dateString, items]) => (
                        <div key={dateString} className="mb-6">
                          <h3 className="text-lg font-medium mb-2">
                            {new Date(dateString).toDateString() === new Date().toDateString()
                              ? "Today"
                              : new Date(dateString).toDateString() === new Date(Date.now() - 86400000).toDateString()
                                ? "Yesterday"
                                : format(new Date(dateString), 'MMMM d, yyyy')}
                          </h3>
                          <Table>
                            <TableBody>
                              {items
                                .sort((a, b) => b.timestamp - a.timestamp)
                                .map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="w-12">
                                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                                        {item.type === "internal" ? (
                                          <FileText className="h-4 w-4 text-blue-500" />
                                        ) : (
                                          <Globe className="h-4 w-4 text-green-500" />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium flex-grow">
                                      <div className="flex flex-col">
                                        <span className="line-clamp-1">{item.title}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{item.url}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-xs">{format(new Date(item.timestamp), 'h:mm a')}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="w-20">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => deleteHistoryItem(item.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="today" className="space-y-4">
                <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                  {/* Similar content structure to "all" tab but filtered for today */}
                  {/* For brevity, I'm keeping this simple; in a real implementation, you'd filter by today */}
                  <p className="text-center text-muted-foreground py-4">
                    Filter by today's browsing history
                  </p>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="yesterday">
                <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                  <p className="text-center text-muted-foreground py-4">
                    Filter by yesterday's browsing history
                  </p>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="older">
                <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                  <p className="text-center text-muted-foreground py-4">
                    Filter by older browsing history
                  </p>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
