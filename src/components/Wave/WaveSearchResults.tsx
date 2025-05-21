
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ExternalLink } from 'lucide-react';

interface WaveSearchResultsProps {
  query: string;
}

const WaveSearchResults: React.FC<WaveSearchResultsProps> = ({ query }) => {
  // Mock search results for demonstration
  const mockResults = [
    {
      id: '1',
      title: 'Understanding Blockchain Technology',
      url: 'https://example.com/blockchain',
      snippet: 'Blockchain is a decentralized, distributed ledger technology that records transactions across many computers. The most well-known use case is in cryptocurrency...',
      source: 'BlockchainInfo',
      badge: 'Featured'
    },
    {
      id: '2',
      title: 'How Smart Contracts Work',
      url: 'https://example.com/smart-contracts',
      snippet: 'Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They run on blockchain networks and automatically execute when conditions are met...',
      source: 'EthereumDocs',
      badge: 'Trending'
    },
    {
      id: '3',
      title: 'Web3 and the Future of the Internet',
      url: 'https://example.com/web3',
      snippet: 'Web3 represents the next phase of the internet, incorporating blockchain technology, decentralization and token-based economics. Unlike Web2, which is dominated by centralized platforms...',
      source: 'Web3Foundation',
      badge: null
    },
    {
      id: '4',
      title: 'DeFi Explained: Decentralized Finance Basics',
      url: 'https://example.com/defi',
      snippet: 'Decentralized Finance (DeFi) is an emerging financial technology based on secure distributed ledgers similar to those used by cryptocurrencies. The system removes intermediaries...',
      source: 'DeFiPulse',
      badge: 'Popular'
    },
    {
      id: '5',
      title: 'NFTs and Digital Ownership',
      url: 'https://example.com/nfts',
      snippet: 'Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of items like art, collectibles, and even real estate in the digital world. Unlike cryptocurrencies...',
      source: 'NFTMarketplace',
      badge: null
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Results for "{query}"</h2>
      
      <div className="space-y-3">
        {mockResults.map(result => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg text-nexus-purple">
                  <a href={result.url} className="hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                    {result.title} <ExternalLink className="h-3 w-3" />
                  </a>
                </h3>
                {result.badge && (
                  <Badge className="bg-nexus-purple text-white">
                    <Zap className="h-3 w-3 mr-1" /> {result.badge}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">{result.source}</p>
              <p className="mt-2">{result.snippet}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WaveSearchResults;
