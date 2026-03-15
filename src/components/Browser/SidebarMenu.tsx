import React, { useState } from "react";
import { Search, BarChart3, Globe, ChevronDown, ChevronUp, Link2, ArrowRightLeft, Compass, Newspaper } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { topProtocols } from "@/lib/protocolData";
import { useNavigate } from "react-router-dom";

interface SidebarMenuProps {
  onNavigate: (url: string) => void;
}

const defiItems = [
  { name: "gTrade Solana", url: "https://sol.gains.trade" },
  { name: "Jup.ag", url: "https://jup.ag" },
  { name: "Solana Token Creator", url: "https://www.solanatokencreator.com" },
  { name: "marginfi", url: "https://marginfi.com" },
  { name: "Save", url: "https://save.finance" },
  { name: "Sharky", url: "https://sharky.fi" },
  { name: "Hawksight", url: "https://hawksight.co" },
  { name: "Streamflow", url: "https://streamflow.finance" },
  { name: "Jito", url: "https://jito.network" },
  { name: "Layerswap", url: "https://layerswap.io" },
  { name: "LayerZero", url: "https://layerzero.network" },
  { name: "Pyth Network", url: "https://pyth.network" },
];

const exchangeItems = [
  { name: "Raydium", url: "https://raydium.io" },
  { name: "Saber", url: "https://saber.so" },
  { name: "Jupiter Exchange", url: "https://jup.ag/swap" },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "defix-gateway": true,
    defi: true,
    exchange: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClick = (url: string) => {
    if (url.startsWith("/")) {
      navigate(url);
      return;
    }
    let processed = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processed = `https://${url}`;
    }
    onNavigate(processed);
  };

  const SectionHeader = ({
    sectionKey,
    icon,
    label,
    indent = 0,
  }: {
    sectionKey: string;
    icon: React.ReactNode;
    label: string;
    indent?: number;
  }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
      style={{ paddingLeft: `${12 + indent * 16}px` }}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {openSections[sectionKey] ? (
        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );

  const NavItem = ({
    name,
    url,
    icon,
    indent = 0,
  }: {
    name: string;
    url: string;
    icon?: React.ReactNode;
    indent?: number;
  }) => (
    <button
      onClick={() => handleClick(url)}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate"
      style={{ paddingLeft: `${12 + indent * 16}px` }}
    >
      {icon || <Link2 className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />}
      <span className="truncate">{name}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-3 pb-1 flex items-center gap-2">
        <img src="/favicon.png" alt="TMRW" className="h-7 w-7" />
        <h2 className="text-base font-bold tracking-wide text-foreground">TMRW W3AI</h2>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-1.5 pb-4 space-y-0.5">
          {/* Discovery */}
          <SectionHeader sectionKey="discovery" icon={<Search className="h-4 w-4" />} label="Discovery" />
          {openSections["discovery"] && (
            <div className="space-y-0.5">
              <NavItem name="Nexus AI Search" url="/search" indent={1} />
              <NavItem name="Extension Store" url="/extension-store" indent={1} />
            </div>
          )}

          {/* Analytics */}
          <SectionHeader sectionKey="analytics" icon={<BarChart3 className="h-4 w-4" />} label="Analytics" />
          {openSections["analytics"] && (
            <div className="space-y-0.5">
              <NavItem name="Token" url="/token" indent={1} />
              <NavItem name="Staking" url="/staking" indent={1} />
            </div>
          )}

          {/* Web3 Browser */}
          <SectionHeader sectionKey="web3-browser" icon={<Compass className="h-4 w-4" />} label="Web3 Browser" />
          {openSections["web3-browser"] && (
            <div className="space-y-0.5">
              <NavItem name="Browser" url="/app" indent={1} />
              <NavItem name="History" url="/history" indent={1} />
              <NavItem name="Settings" url="/settings" indent={1} />
            </div>
          )}

          {/* Defix Gateway */}
          <SectionHeader sectionKey="defix-gateway" icon={<Globe className="h-4 w-4" />} label="Defix Gateway" />
          {openSections["defix-gateway"] && (
            <div className="space-y-0.5">
              <SectionHeader sectionKey="defi" icon={<Link2 className="h-4 w-4" />} label="DeFi" indent={1} />
              {openSections["defi"] && (
                <div className="space-y-0.5">
                  {defiItems.map((item) => (
                    <NavItem key={item.name} name={item.name} url={item.url} indent={2} />
                  ))}
                </div>
              )}

              <SectionHeader sectionKey="exchange" icon={<ArrowRightLeft className="h-4 w-4" />} label="Exchange" indent={1} />
              {openSections["exchange"] && (
                <div className="space-y-0.5">
                  {exchangeItems.map((item) => (
                    <NavItem key={item.name} name={item.name} url={item.url} indent={2} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Protocols */}
          <SectionHeader sectionKey="protocols" icon={<Link2 className="h-4 w-4" />} label="Protocols" />
          {openSections["protocols"] && (
            <div className="space-y-0.5">
              {topProtocols.map((protocol) => (
                <NavItem
                  key={protocol.id}
                  name={protocol.name}
                  url={protocol.url}
                  indent={1}
                  icon={
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: protocol.color }}
                    />
                  }
                />
              ))}
            </div>
          )}

          {/* Trending DEX */}
          <div className="mt-3 mx-1.5 p-2.5 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Trending DEX</p>
            <button
              onClick={() => handleClick("https://app.uniswap.org")}
              className="w-full flex items-center justify-between text-sm"
            >
              <span className="text-foreground font-medium">Uniswap v3</span>
              <span className="text-green-400 text-xs font-medium">+5.2% ↗</span>
            </button>
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
};

export default SidebarMenu;
