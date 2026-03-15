import React, { useState } from "react";
import { Menu, Search, BarChart3, Globe, ChevronDown, ChevronUp, Link2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { topProtocols } from "@/lib/protocolData";

interface ProtocolsMenuProps {
  onNavigate: (url: string) => void;
}

interface MenuSection {
  label: string;
  icon: React.ReactNode;
  children?: MenuSection[];
  items?: { name: string; url: string }[];
  route?: string;
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

const ProtocolsMenu: React.FC<ProtocolsMenuProps> = ({ onNavigate }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "defix-gateway": true,
    defi: true,
    exchange: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClick = (url: string) => {
    let processed = url;
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
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
      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
      style={{ paddingLeft: `${12 + indent * 16}px` }}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {label}
      </span>
      {openSections[sectionKey] ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
    <SheetClose asChild>
      <button
        onClick={() => handleClick(url)}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate"
        style={{ paddingLeft: `${12 + indent * 16}px` }}
      >
        {icon || <Link2 className="h-4 w-4 flex-shrink-0 text-primary/70" />}
        <span className="truncate">{name}</span>
      </button>
    </SheetClose>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Open protocols menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:w-80 p-0 bg-background border-border">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="text-lg font-bold tracking-wide">PLATO W3 AI</SheetTitle>
          <SheetDescription className="sr-only">Navigation menu</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <nav className="px-2 pb-4 space-y-0.5">
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
            <SectionHeader sectionKey="web3-browser" icon={<Globe className="h-4 w-4" />} label="Web3 Browser" />
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
                {/* DeFi sub-section */}
                <SectionHeader sectionKey="defi" icon={<Link2 className="h-4 w-4" />} label="DeFi" indent={1} />
                {openSections["defi"] && (
                  <div className="space-y-0.5">
                    {defiItems.map((item) => (
                      <NavItem key={item.name} name={item.name} url={item.url} indent={2} />
                    ))}
                  </div>
                )}

                {/* Exchange sub-section */}
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

            {/* Trending DEX footer */}
            <div className="mt-4 mx-2 p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Trending DEX</p>
              <SheetClose asChild>
                <button
                  onClick={() => handleClick("https://app.uniswap.org")}
                  className="w-full flex items-center justify-between text-sm"
                >
                  <span className="text-foreground font-medium">Uniswap v3</span>
                  <span className="text-green-400 text-xs font-medium">+5.2% ↗</span>
                </button>
              </SheetClose>
            </div>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProtocolsMenu;
