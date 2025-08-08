import React from "react";
import { Menu } from "lucide-react";
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
import { getAlphabetizedBookmarks } from "@/utils/bookmarkUtils";
import { topProtocols } from "@/lib/protocolData";

interface ProtocolsMenuProps {
  onNavigate: (url: string) => void;
}

const ProtocolsMenu: React.FC<ProtocolsMenuProps> = ({ onNavigate }) => {
  const bookmarks = getAlphabetizedBookmarks();
  const protocolNames = new Set(topProtocols.map((p) => p.name));
  const protocols = bookmarks.filter((b) => protocolNames.has(b.title));

  const handleClick = (url: string) => {
    let processed = url;
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
      processed = `https://${url}`;
    }
    onNavigate(processed);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open protocols menu">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:w-80 p-0">
        <SheetHeader className="p-4">
          <SheetTitle>Protocols</SheetTitle>
          <SheetDescription>Quick access to your favorite protocols</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-112px)]">
          <nav className="px-2 pb-4">
            <ul className="space-y-1">
              {protocols.map((item) => (
                <li key={item.id}>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={() => handleClick(item.url)}
                    >
                      <span
                        aria-hidden
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.title}</span>
                    </Button>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProtocolsMenu;
