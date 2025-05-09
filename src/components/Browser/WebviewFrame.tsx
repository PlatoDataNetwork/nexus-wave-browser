
import React, { useState, useEffect } from "react";
import { Bookmark, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Extract domain for display purposes
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];

  // Handle iframe load events
  useEffect(() => {
    // Reset states on URL change
    setIsLoading(true);
    setProgress(0);
    setShowFallback(false);
    
    console.log(`Loading URL in WebviewFrame: ${url}`);
    
    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    const timer = setTimeout(() => {
      clearInterval(loadingInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 1000);
    
    return () => {
      clearInterval(loadingInterval);
      clearTimeout(timer);
    };
  }, [url]);

  const handleIframeError = () => {
    console.error("Iframe loading error!");
    setShowFallback(true);
    toast.error("Could not load website content. Displaying fallback interface.");
  };

  // Generate demo HTML content for the iframe
  // This simulates a real website while avoiding CORS/iframe embedding issues
  const generateDemoContent = () => {
    // Use different templates for well-known sites
    if (domain.includes("magiceden")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #0c0e14;
                color: white;
              }
              header {
                padding: 16px;
                background: #9c2cf9;
                display: flex;
                align-items: center;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
              }
              .banner {
                width: 100%;
                height: 300px;
                background-image: linear-gradient(to right, #9c2cf9, #c17afa);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
              }
              .nft-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
              }
              .nft-card {
                background: #181b25;
                border-radius: 12px;
                overflow: hidden;
                transition: transform 0.2s;
              }
              .nft-card:hover {
                transform: translateY(-5px);
              }
              .nft-image {
                height: 200px;
                background-size: cover;
                background-position: center;
              }
              .nft-info {
                padding: 12px;
              }
              .tag {
                display: inline-block;
                background: #2c2f3b;
                color: #9c2cf9;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                margin-right: 6px;
              }
              .price {
                font-weight: bold;
                color: #9c2cf9;
                margin-top: 8px;
                font-size: 18px;
              }
              .search-bar {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                display: flex;
                padding: 0 20px;
              }
              .search-input {
                flex: 1;
                padding: 12px 16px;
                border-radius: 8px;
                border: none;
                background: #181b25;
                color: white;
                font-size: 16px;
              }
              .search-button {
                margin-left: 10px;
                background: #9c2cf9;
                color: white;
                border: none;
                padding: 0 20px;
                border-radius: 8px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">Magic Eden</div>
              <div>NFT Marketplace</div>
            </header>
            <div class="banner">
              <h1>Discover, Collect, and Sell NFTs</h1>
              <p>The leading cross-chain NFT platform for the next million users</p>
            </div>
            <div class="search-bar">
              <input class="search-input" placeholder="Search collections, NFTs, or users...">
              <button class="search-button">Search</button>
            </div>
            <div class="nft-grid">
              ${Array(12).fill(0).map((_, i) => `
                <div class="nft-card">
                  <div class="nft-image" style="background: ${['#9c2cf9', '#c17afa', '#7a56ff', '#5a5df9'][i % 4]}"></div>
                  <div class="nft-info">
                    <div>
                      <span class="tag">Solana</span>
                      <span class="tag">Verified</span>
                    </div>
                    <h3>${['Cosmic Creatures', 'Magic Monkeys', 'Pixel Warriors', 'Cyber Punks', 'Digital Dreamers', 'Meta Knights'][i % 6]} #${1000 + i}</h3>
                    <div class="price">${(0.5 + i * 0.25).toFixed(2)} SOL</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
    } else if (domain.includes("opensea")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #141517;
                color: white;
              }
              header {
                padding: 16px;
                background: #1868b7;
                display: flex;
                align-items: center;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
              }
              .banner {
                width: 100%;
                background-image: linear-gradient(to right, #1a1b22, #2d2e38);
                padding: 40px 20px;
                text-align: center;
              }
              .nft-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 20px;
                padding: 20px;
              }
              .nft-card {
                background: #222432;
                border-radius: 10px;
                overflow: hidden;
              }
              .nft-image {
                height: 200px;
                background: #2a2d3a;
              }
              .nft-info {
                padding: 10px;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">OpenSea</div>
              <div>NFTs & Digital Items</div>
            </header>
            <div class="banner">
              <h1>Welcome to OS2. Your new home for NFTs and tokens.</h1>
            </div>
            <div class="nft-grid">
              ${Array(8).fill(0).map(() => `
                <div class="nft-card">
                  <div class="nft-image"></div>
                  <div class="nft-info">
                    <h3>NFT Collection</h3>
                    <p>Floor: 0.08 ETH</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
    } else if (domain.includes("platodata")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #0f1118;
                color: white;
              }
              header {
                padding: 16px;
                background: #16192a;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #2a2f45;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
                color: #6772e5;
              }
              .hero {
                width: 100%;
                background-image: linear-gradient(to right, #16192a, #22273c);
                padding: 60px 20px;
                text-align: center;
              }
              .data-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                padding: 40px 20px;
              }
              .data-card {
                background: #1a1f33;
                border-radius: 10px;
                padding: 20px;
                border: 1px solid #2a2f45;
              }
              .data-title {
                font-size: 18px;
                margin-bottom: 10px;
                color: #6772e5;
              }
              .data-value {
                font-size: 28px;
                font-weight: bold;
              }
              .chart-placeholder {
                height: 120px;
                background: linear-gradient(45deg, #1a1f33 25%, #242a40 25%, #242a40 50%, #1a1f33 50%, #1a1f33 75%, #242a40 75%, #242a40 100%);
                background-size: 20px 20px;
                opacity: 0.3;
                margin-top: 15px;
                border-radius: 6px;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">PlatoData.io</div>
              <div>Web3 Analytics & Insights</div>
            </header>
            <div class="hero">
              <h1>Welcome to Web3 Analytics Dashboard</h1>
              <p>Comprehensive data insights for blockchain and DeFi protocols</p>
            </div>
            <div class="data-grid">
              ${Array(6).fill(0).map((_, i) => `
                <div class="data-card">
                  <div class="data-title">${['Total Value Locked', 'Daily Active Addresses', 'Transaction Volume', 'Gas Used', 'NFT Sales', 'Protocol Revenue'][i]}</div>
                  <div class="data-value">${['$4.28B', '1.24M', '$892.5M', '12.4 ETH', '8,245', '$3.75M'][i]}</div>
                  <div class="chart-placeholder"></div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
    } else if (domain.includes("ethereum") || domain.includes("eth")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #f7f8fa;
                color: #333;
              }
              header {
                padding: 16px;
                background: #627eea;
                color: white;
                display: flex;
                align-items: center;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
              }
              .hero {
                width: 100%;
                background-image: linear-gradient(to right, #627eea, #8097ef);
                padding: 60px 20px;
                text-align: center;
                color: white;
              }
              .content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
              }
              .stat {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                flex: 1;
                margin: 0 10px;
              }
              .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #627eea;
              }
              .blocks {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 20px;
              }
              .block {
                padding: 15px 0;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">Ethereum</div>
              <div>Blockchain Explorer</div>
            </header>
            <div class="hero">
              <h1>Ethereum Blockchain</h1>
              <p>Decentralized, open-source blockchain with smart contract functionality</p>
            </div>
            <div class="content">
              <div class="stats">
                <div class="stat">
                  <div>Current Price</div>
                  <div class="stat-value">$3,487.21</div>
                </div>
                <div class="stat">
                  <div>Market Cap</div>
                  <div class="stat-value">$419.2B</div>
                </div>
                <div class="stat">
                  <div>Network Hash Rate</div>
                  <div class="stat-value">980 TH/s</div>
                </div>
                <div class="stat">
                  <div>Difficulty</div>
                  <div class="stat-value">12.65P</div>
                </div>
              </div>
              <div class="blocks">
                <h2>Latest Blocks</h2>
                ${Array(5).fill(0).map((_, i) => `
                  <div class="block">
                    <div>Block #${16482937 - i}</div>
                    <div>${Math.floor(Math.random() * 300) + 100} transactions</div>
                    <div>${Math.floor(Math.random() * 10) + 2} mins ago</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (domain.includes("aave")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: system-ui, sans-serif;
                background: #070b15;
                color: white;
              }
              header {
                padding: 16px 20px;
                background: #13182c;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .logo {
                font-weight: bold;
                font-size: 22px;
                color: #b6baff;
                display: flex;
                align-items: center;
              }
              .logo-circle {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #b6baff, #9498f7);
                margin-right: 10px;
              }
              .nav {
                display: flex;
                gap: 24px;
                color: rgba(255,255,255,0.7);
              }
              .banner {
                background: linear-gradient(135deg, #13182c, #1c2042);
                padding: 40px 20px 70px;
                position: relative;
              }
              .stats-row {
                display: flex;
                justify-content: space-between;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                position: relative;
                z-index: 2;
              }
              .stat-card {
                margin-top: -50px;
                background: #0c1122;
                border-radius: 10px;
                padding: 24px;
                width: calc(33% - 16px);
                box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.05);
                text-align: center;
              }
              .stat-value {
                font-size: 32px;
                font-weight: bold;
                color: #b6baff;
                margin: 16px 0 8px;
              }
              .stat-title {
                opacity: 0.7;
                margin-bottom: 8px;
              }
              .content {
                padding: 40px 20px;
                max-width: 1200px;
                margin: 0 auto;
              }
              .table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin-top: 30px;
              }
              .table th {
                text-align: left;
                padding: 16px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.7);
                font-weight: 500;
              }
              .table td {
                padding: 16px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
              }
              .token-col {
                display: flex;
                align-items: center;
              }
              .token-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #2a3052;
                margin-right: 12px;
              }
              .positive {
                color: #5ac4be;
              }
              .button {
                background: #1c2042;
                color: #b6baff;
                border: 1px solid rgba(255,255,255,0.1);
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">
                <div class="logo-circle"></div>
                Aave
              </div>
              <div class="nav">
                <div>Markets</div>
                <div>Dashboard</div>
                <div>Governance</div>
                <div>Stake</div>
              </div>
            </header>
            
            <section class="banner">
              <div class="stats-row">
                <div class="stat-card">
                  <div class="stat-title">Total Market Size</div>
                  <div class="stat-value">$5.77B</div>
                  <div>Across all networks</div>
                </div>
                <div class="stat-card">
                  <div class="stat-title">Total Value Locked</div>
                  <div class="stat-value">$3.42B</div>
                  <div>Across all networks</div>
                </div>
                <div class="stat-card">
                  <div class="stat-title">AAVE Price</div>
                  <div class="stat-value">$104.29</div>
                  <div class="positive">+2.34%</div>
                </div>
              </div>
            </section>
            
            <section class="content">
              <h2>Ethereum Markets</h2>
              
              <table class="table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Total Supplied</th>
                    <th>Supply APY</th>
                    <th>Total Borrowed</th>
                    <th>Borrow APY</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    {token: 'ETH', supply: '$921.4M', supplyApy: '1.26%', borrow: '$512.2M', borrowApy: '2.52%'},
                    {token: 'USDC', supply: '$768.7M', supplyApy: '3.45%', borrow: '$402.8M', borrowApy: '4.90%'},
                    {token: 'WBTC', supply: '$432.3M', supplyApy: '0.87%', borrow: '$176.5M', borrowApy: '1.95%'},
                    {token: 'DAI', supply: '$397.6M', supplyApy: '3.21%', borrow: '$183.4M', borrowApy: '4.67%'},
                    {token: 'LINK', supply: '$156.2M', supplyApy: '0.91%', borrow: '$42.7M', borrowApy: '2.81%'}
                  ].map(item => `
                    <tr>
                      <td>
                        <div class="token-col">
                          <div class="token-icon"></div>
                          ${item.token}
                        </div>
                      </td>
                      <td>${item.supply}</td>
                      <td class="positive">${item.supplyApy}</td>
                      <td>${item.borrow}</td>
                      <td>${item.borrowApy}</td>
                      <td><button class="button">Supply</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </section>
          </body>
        </html>
      `;
    } else if (domain.includes("gist") && domain.includes("alekbot")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                background: #0d1117;
                color: #c9d1d9;
              }
              header {
                padding: 16px;
                background: #161b22;
                border-bottom: 1px solid #30363d;
                display: flex;
                align-items: center;
              }
              .logo {
                font-weight: bold;
                font-size: 20px;
                margin-right: 20px;
              }
              .header-nav {
                display: flex;
                gap: 16px;
              }
              .header-item {
                color: #8b949e;
                cursor: pointer;
              }
              .content-wrapper {
                max-width: 1012px;
                margin: 0 auto;
                padding: 24px;
              }
              .gist-header {
                margin-bottom: 16px;
                border-bottom: 1px solid #30363d;
                padding-bottom: 16px;
              }
              .gist-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
              }
              .gist-meta {
                font-size: 14px;
                color: #8b949e;
              }
              .username {
                font-weight: 600;
                color: #58a6ff;
              }
              .file-header {
                background: #161b22;
                padding: 8px 16px;
                border: 1px solid #30363d;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                display: flex;
                justify-content: space-between;
              }
              .file-name {
                font-family: monospace;
                font-size: 14px;
              }
              .file-actions {
                color: #8b949e;
                font-size: 12px;
              }
              pre {
                border: 1px solid #30363d;
                border-top: none;
                margin: 0;
                padding: 16px;
                overflow-x: auto;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
                background: #0d1117;
                font-family: monospace;
                font-size: 14px;
                line-height: 1.5;
                color: #c9d1d9;
              }
              .alek-bot {
                color: #58a6ff;
                font-weight: bold;
              }
              .function {
                color: #d2a8ff;
              }
              .keyword {
                color: #ff7b72;
              }
              .string {
                color: #a5d6ff;
              }
              .comment {
                color: #8b949e;
                font-style: italic;
              }
              .button-row {
                margin-top: 16px;
                display: flex;
                gap: 8px;
              }
              .button {
                background: #238636;
                color: #ffffff;
                border: 1px solid rgba(240,246,252,0.1);
                border-radius: 6px;
                padding: 5px 16px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">GitHub Gist</div>
              <div class="header-nav">
                <div class="header-item">All gists</div>
                <div class="header-item">Back to GitHub</div>
              </div>
            </header>
            
            <div class="content-wrapper">
              <div class="gist-header">
                <div class="gist-title">Alek Bot: Conversation Management System</div>
                <div class="gist-meta">
                  Created by <span class="username">AlekBot</span> on May 5, 2025 • <span>5 files</span>
                </div>
              </div>
              
              <div>
                <div class="file-header">
                  <div class="file-name">alek_bot.js</div>
                  <div class="file-actions">Raw | Copy</div>
                </div>
                <pre><span class="comment">/**
 * Alek Bot - Web3 Browser Assistant
 * Enhanced AI capabilities for Nexus Wave Browser
 */</span>

<span class="keyword">class</span> <span class="alek-bot">AlekBot</span> {
  <span class="function">constructor</span>() {
    <span class="keyword">this</span>.name = <span class="string">"Alek"</span>;
    <span class="keyword">this</span>.version = <span class="string">"3.5.2"</span>;
    <span class="keyword">this</span>.capabilities = [
      <span class="string">"blockchain_data_analysis"</span>,
      <span class="string">"web3_wallet_integration"</span>,
      <span class="string">"defi_protocol_scanning"</span>,
      <span class="string">"nft_metadata_extraction"</span>,
      <span class="string">"smart_contract_verification"</span>
    ];
    <span class="keyword">this</span>.initAssistant();
  }

  <span class="function">async</span> <span class="function">initAssistant</span>() {
    <span class="keyword">await</span> <span class="keyword">this</span>.loadWeb3Models();
    <span class="keyword">await</span> <span class="keyword">this</span>.connectBlockchainNodes();
    console.log(<span class="string">"Alek Bot initialized and ready to assist!"</span>);
  }
  
  <span class="function">async</span> <span class="function">analyzeSmartContract</span>(contractAddress) {
    <span class="comment">// Security analysis logic</span>
    <span class="keyword">const</span> vulnerabilities = <span class="keyword">await</span> <span class="keyword">this</span>.scanForVulnerabilities(contractAddress);
    <span class="keyword">return</span> {
      securityScore: <span class="keyword">this</span>.calculateSecurityScore(vulnerabilities),
      issues: vulnerabilities,
      recommendation: <span class="keyword">this</span>.generateSecurityRecommendation(vulnerabilities)
    };
  }
  
  <span class="function">provideBrowserAssistance</span>() {
    <span class="keyword">return</span> {
      activeHelp: <span class="keyword">true</span>,
      enhancedPrivacy: <span class="keyword">true</span>,
      web3Integration: <span class="keyword">this</span>.web3IntegrationStatus,
      currentChain: <span class="keyword">this</span>.detectedBlockchain
    };
  }
}

<span class="keyword">const</span> aleksAssistant = <span class="keyword">new</span> <span class="alek-bot">AlekBot</span>();
<span class="keyword">export</span> <span class="keyword">default</span> aleksAssistant;</pre>
              </div>
              
              <div class="button-row">
                <button class="button">Star</button>
                <button class="button">Fork</button>
              </div>
            </div>
          </body>
        </html>
      `;
    }
    
    // Generic template for other sites
    return `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              background: #f4f5f7;
              color: #333;
              height: 100vh;
              width: 100vw;
              overflow: hidden;
            }
            header {
              padding: 16px;
              background: #3c40c6;
              color: white;
              text-align: center;
            }
            .content {
              padding: 40px 20px;
              max-width: 1200px;
              margin: 0 auto;
              height: calc(100vh - 180px);
              overflow-y: auto;
            }
            .hero {
              background: linear-gradient(45deg, #3c40c6, #5352ed);
              padding: 60px 20px;
              text-align: center;
              color: white;
              margin-bottom: 40px;
            }
            .cards {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 20px;
              margin-top: 40px;
            }
            .card {
              background: white;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <header>
            <h2>${domain}</h2>
          </header>
          <div class="hero">
            <h1>Welcome to ${domain}</h1>
            <p>This is a simulated view of ${url}</p>
          </div>
          <div class="content">
            <p>The Nexus Wave Browser prototype is showing this website content.</p>
            <p>In a real implementation, this would render actual web content via a browser engine.</p>
            
            <div class="cards">
              ${Array(4).fill(0).map((_, i) => `
                <div class="card">
                  <h3>Featured Content ${i+1}</h3>
                  <p>This is sample content for ${domain}. In a real browser, you would see the actual website content here.</p>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Loading bar */}
      {isLoading && (
        <div className="relative h-1">
          <Progress value={progress} className="h-1 bg-muted" />
        </div>
      )}
      
      {/* Website content - taking up full available space */}
      <div className="flex-1 flex items-center justify-center h-full w-full overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-8 w-8 text-nexus-purple animate-spin" />
          </div>
        ) : showFallback ? (
          <FallbackInterface domain={domain} />
        ) : (
          <iframe 
            srcDoc={generateDemoContent()}
            className="w-full h-full border-0"
            title={`Web content for ${domain}`}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts"
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
        )}
      </div>
    </div>
  );
};

// Fallback interface when iframe fails to load or for restricted sites
const FallbackInterface: React.FC<{ domain: string }> = ({ domain }) => {
  return (
    <div className="text-center py-10 px-4 max-w-3xl mx-auto">
      <Globe className="mx-auto h-20 w-20 text-[#8c7ae6] mb-6" />
      <h2 className="text-3xl font-bold mb-3 text-white">Nexus Web3 Browser</h2>
      
      <p className="text-lg text-gray-300 mb-6">
        Currently displaying: <span className="text-[#8c7ae6]">{domain}</span>
      </p>
      
      <p className="text-base text-gray-400 mb-10">
        This website couldn't be displayed in the iframe due to security restrictions.
        In a real implementation, this would render web content via Chromium's webview.
      </p>
      
      <div className="bg-[#1e2132] rounded-lg p-6 mb-8 max-w-xl mx-auto border border-[#2a2f45]">
        <div className="flex items-center mb-4">
          <Globe className="h-6 w-6 mr-3 text-[#8c7ae6]" />
          <h3 className="text-xl font-medium text-white">Web3-Optimized Features</h3>
        </div>
        
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">Built-in cryptocurrency wallet integration</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">DApp browser with Web3 support</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">Privacy-focused with built-in ad blocker</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">Chromium-based for compatibility</span>
          </li>
        </ul>
      </div>
      
      <Button className="bg-[#8c7ae6] hover:bg-[#7c6ad6] text-white px-6 py-2 rounded-md transition-colors flex items-center mx-auto">
        <Bookmark className="h-5 w-5 mr-2" />
        Add to Bookmarks
      </Button>
    </div>
  );
};

export default WebviewFrame;
