import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Star, Heart } from "lucide-react";
import {
  MessagesSquare,
  Globe,
  ShieldCheck,
  Zap,
  Tv,
  UserPlus,
  Video,
  Share2,
  Mail,
  FileText,
  Bell,
  Megaphone,
  Hash,
  Bitcoin,
  Wallet,
  BarChart4,
  Landmark,
  Shield,
  Lock,
  AlertTriangle,
  KeyRound,
  Eye,
  Fingerprint,
  Link,
  Network,
  Image,
  Music,
  Sparkles,
  Code,
  Search,
  Brain,
  Bot,
  Camera,
  MessageSquare,
  Headphones,
  Wand,
  Monitor,
  Settings
} from "lucide-react";

interface ConceptualExtensionProps {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconBg: string;
  estimatedRelease: string;
  rating: number;
  version: string;
}

const iconBackgrounds = [
  "bg-gradient-to-br from-purple-500 to-purple-700",
  "bg-gradient-to-br from-blue-500 to-blue-700",
  "bg-gradient-to-br from-pink-500 to-pink-700",
  "bg-gradient-to-br from-emerald-500 to-emerald-700",
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-sky-500 to-sky-700",
  "bg-gradient-to-br from-rose-500 to-rose-700",
  "bg-gradient-to-br from-indigo-500 to-indigo-700",
];

// Create 30 conceptual extensions
const conceptualExtensions: ConceptualExtensionProps[] = [
  // Media Category (6)
  {
    id: 1,
    name: "PixelPerfect AI",
    description: "AI-powered image enhancement that automatically improves photo quality, removes noise, and adds professional effects.",
    category: "Media",
    icon: Image,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "July 2025",
    rating: 4.9,
    version: "0.9.5"
  },
  {
    id: 2,
    name: "MusicStream Pro",
    description: "Advanced music player with spatial audio support, enhancing your streaming experience with immersive sound quality.",
    category: "Media",
    icon: Music,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "August 2025",
    rating: 4.8,
    version: "0.8.7"
  },
  {
    id: 3,
    name: "VideoSync",
    description: "Synchronize video playback across multiple devices with frame-perfect timing for group viewing experiences.",
    category: "Media",
    icon: Video,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "September 2025",
    rating: 4.7,
    version: "0.7.2"
  },
  {
    id: 4,
    name: "MediaVault",
    description: "Secure cloud storage specifically optimized for high-quality media files with intelligent organization features.",
    category: "Media",
    icon: Tv,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "October 2025",
    rating: 4.6,
    version: "0.9.1"
  },
  {
    id: 5,
    name: "StreamCast",
    description: "Cast any media content from your browser to any smart device with advanced quality controls and subtitles.",
    category: "Media",
    icon: Zap,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "November 2025",
    rating: 4.5,
    version: "0.8.3"
  },
  {
    id: 6,
    name: "MediaTranslator",
    description: "Real-time translation of audio and subtitles in streaming content with support for over 50 languages.",
    category: "Media",
    icon: Globe,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "December 2025",
    rating: 4.7,
    version: "0.7.9"
  },

  // Communications Category (6)
  {
    id: 7,
    name: "VoiceConnect",
    description: "Crystal-clear voice calling directly from your browser with noise cancellation and voice enhancement.",
    category: "Communications",
    icon: MessagesSquare,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.8"
  },
  {
    id: 8,
    name: "MailGuard",
    description: "Advanced email protection that detects phishing attempts, scams, and malicious content before they reach your inbox.",
    category: "Communications",
    icon: Mail,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "July 2025",
    rating: 4.8,
    version: "0.8.5"
  },
  {
    id: 9,
    name: "DocCollab",
    description: "Real-time document collaboration with version history and secure sharing features across all major platforms.",
    category: "Communications",
    icon: FileText,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "August 2025",
    rating: 4.7,
    version: "0.9.2"
  },
  {
    id: 10,
    name: "NotifyHub",
    description: "Centralized notification management that organizes alerts from all your communication channels in one place.",
    category: "Communications",
    icon: Bell,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "September 2025",
    rating: 4.6,
    version: "0.7.1"
  },
  {
    id: 11,
    name: "TransVoice",
    description: "Real-time voice translation during calls, supporting seamless communication across language barriers.",
    category: "Communications",
    icon: Globe,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "October 2025",
    rating: 4.8,
    version: "0.8.4"
  },
  {
    id: 12,
    name: "MessageVault",
    description: "Secure end-to-end encrypted messaging with self-destructing messages and secure file sharing capabilities.",
    category: "Communications",
    icon: Lock,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "November 2025",
    rating: 4.9,
    version: "0.9.0"
  },

  // Social Category (6)
  {
    id: 13,
    name: "SocialConnect",
    description: "Unified dashboard for managing all your social media accounts with scheduled posting and analytics.",
    category: "Social",
    icon: Share2,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "June 2025",
    rating: 4.8,
    version: "0.9.5"
  },
  {
    id: 14,
    name: "TrendSpotter",
    description: "Real-time trend detection across social platforms with insights and content suggestions based on viral topics.",
    category: "Social",
    icon: Hash,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "July 2025",
    rating: 4.7,
    version: "0.8.2"
  },
  {
    id: 15,
    name: "InfluenceTracker",
    description: "Analytics tool for measuring social media engagement, growth metrics, and audience demographics across platforms.",
    category: "Social",
    icon: BarChart4,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "August 2025",
    rating: 4.6,
    version: "0.7.9"
  },
  {
    id: 16,
    name: "SocialGuard",
    description: "Protection from harassment and harmful content on social media with customizable content filters.",
    category: "Social",
    icon: Shield,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "September 2025",
    rating: 4.9,
    version: "0.9.3"
  },
  {
    id: 17,
    name: "NetworkPro",
    description: "Professional networking tool that suggests connections and opportunities based on your career goals.",
    category: "Social",
    icon: UserPlus,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "October 2025",
    rating: 4.5,
    version: "0.8.1"
  },
  {
    id: 18,
    name: "BrandAmp",
    description: "Social media amplification tool for businesses to increase reach and engagement through optimized content strategies.",
    category: "Social",
    icon: Megaphone,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "November 2025",
    rating: 4.7,
    version: "0.8.8"
  },

  // Crypto Category (6)
  {
    id: 19,
    name: "CryptoPortfolio",
    description: "Comprehensive portfolio tracker for cryptocurrencies with real-time price alerts and performance analytics.",
    category: "Crypto",
    icon: Bitcoin,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.7"
  },
  {
    id: 20,
    name: "SecureWallet",
    description: "Multi-chain wallet with hardware security integration and biometric authentication for maximum protection.",
    category: "Crypto",
    icon: Wallet,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "July 2025",
    rating: 4.8,
    version: "0.8.5"
  },
  {
    id: 21,
    name: "DeFiDashboard",
    description: "All-in-one dashboard for managing DeFi investments, tracking yields, and analyzing protocol risks.",
    category: "Crypto",
    icon: BarChart4,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "August 2025",
    rating: 4.7,
    version: "0.9.2"
  },
  {
    id: 22,
    name: "TokenSwap",
    description: "Decentralized exchange aggregator finding the best rates across multiple chains with minimal slippage.",
    category: "Crypto",
    icon: Network,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "September 2025",
    rating: 4.6,
    version: "0.8.3"
  },
  {
    id: 23,
    name: "CryptoTax",
    description: "Automated cryptocurrency tax reporting that integrates with major exchanges and generates compliant tax documents.",
    category: "Crypto",
    icon: Landmark,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "October 2025",
    rating: 4.8,
    version: "0.9.0"
  },
  {
    id: 24,
    name: "BlockVerify",
    description: "Blockchain explorer that verifies transactions and smart contracts with detailed analytics and visualizations.",
    category: "Crypto",
    icon: ShieldCheck,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "November 2025",
    rating: 4.7,
    version: "0.8.7"
  },

  // Security Category (6)
  {
    id: 25,
    name: "PrivacyShield",
    description: "Complete privacy protection suite with anti-tracking, fingerprint masking, and encrypted browsing features.",
    category: "Security",
    icon: Shield,
    iconBg: iconBackgrounds[4],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.8"
  },
  {
    id: 26,
    name: "SecurePass",
    description: "Advanced password manager with breach monitoring and hardware key integration for maximum account security.",
    category: "Security",
    icon: KeyRound,
    iconBg: iconBackgrounds[4],
    estimatedRelease: "July 2025",
    rating: 4.8,
    version: "0.9.3"
  },
  {
    id: 27,
    name: "ThreatDefender",
    description: "Real-time protection against malware, phishing attempts, and zero-day exploits while browsing the web.",
    category: "Security",
    icon: AlertTriangle,
    iconBg: iconBackgrounds[4],
    estimatedRelease: "August 2025",
    rating: 4.7,
    version: "0.8.5"
  },
  {
    id: 28,
    name: "BioGuard",
    description: "Biometric authentication system for websites that supports facial recognition and fingerprint verification.",
    category: "Security",
    icon: Fingerprint,
    iconBg: iconBackgrounds[4],
    estimatedRelease: "September 2025",
    rating: 4.9,
    version: "0.9.1"
  },
  {
    id: 29,
    name: "EncryptVault",
    description: "End-to-end encryption for your sensitive files and messages with secure cloud storage and sharing.",
    category: "Security",
    icon: Lock,
    iconBg: iconBackgrounds[4],
    estimatedRelease: "October 2025",
    rating: 4.8,
    version: "0.8.9"
  },
  {
    id: 30,
    name: "SafeConnect",
    description: "Advanced VPN service with quantum-resistant encryption and automatic connection protection on unsecured networks.",
    category: "Security",
    icon: Link,
    iconBg: iconBackgrounds[4],
    estimatedRelease: "November 2025",
    rating: 4.6,
    version: "0.7.8"
  },

  // AI Category (20 new extensions)
  {
    id: 31,
    name: "AIWriter Pro",
    description: "Advanced AI writing assistant that enhances your writing with context-aware suggestions, tone adjustments, and complete document generation.",
    category: "AI",
    icon: Bot,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.8"
  },
  {
    id: 32,
    name: "ImageGenius",
    description: "Generate custom images from text descriptions with fine-tuned style controls and advanced editing capabilities right in your browser.",
    category: "AI",
    icon: Image,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "July 2025",
    rating: 4.8,
    version: "0.8.6"
  },
  {
    id: 33,
    name: "CodeCopilot",
    description: "AI-powered code assistant that provides real-time code suggestions, bug detection, and optimization recommendations while you program.",
    category: "AI",
    icon: Code,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "August 2025",
    rating: 4.9,
    version: "0.9.5"
  },
  {
    id: 34,
    name: "SummaryAI",
    description: "Instantly generate concise summaries of long articles, documents and videos with key points highlighted for quick understanding.",
    category: "AI",
    icon: FileText,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "July 2025",
    rating: 4.7,
    version: "0.8.2"
  },
  {
    id: 35,
    name: "ResearchAssistant",
    description: "AI research tool that finds, analyzes, and synthesizes information from multiple sources with automatic citation generation.",
    category: "AI",
    icon: Search,
    iconBg: iconBackgrounds[0],
    estimatedRelease: "August 2025",
    rating: 4.8,
    version: "0.9.1"
  },
  {
    id: 36,
    name: "VoiceGenius",
    description: "Convert text to natural-sounding speech in 40+ languages with customizable voices, emotions, and accents for content creation.",
    category: "AI",
    icon: Headphones,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.7"
  },
  {
    id: 37,
    name: "PresentationAI",
    description: "Generate professional slides and presentations from simple text prompts with custom themes, graphics, and talking points.",
    category: "AI",
    icon: Monitor,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "September 2025",
    rating: 4.6,
    version: "0.8.3"
  },
  {
    id: 38,
    name: "MeetingMinds",
    description: "AI meeting assistant that transcribes, summarizes, and extracts action items from your virtual meetings with assigned responsibilities.",
    category: "AI",
    icon: MessageSquare,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "July 2025",
    rating: 4.7,
    version: "0.9.0"
  },
  {
    id: 39,
    name: "DataVizard",
    description: "Transform complex data into insightful visualizations and interactive charts with AI-powered analysis and recommendations.",
    category: "AI",
    icon: BarChart4,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "August 2025",
    rating: 4.8,
    version: "0.8.5"
  },
  {
    id: 40,
    name: "TranslatorGenius",
    description: "Real-time AI translation for 100+ languages with contextual understanding, slang interpretation, and cultural nuance preservation.",
    category: "AI",
    icon: Globe,
    iconBg: iconBackgrounds[1],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.6"
  },
  {
    id: 41,
    name: "StyleAI",
    description: "AI fashion assistant that analyzes your wardrobe, suggests outfit combinations, and provides personalized shopping recommendations.",
    category: "AI",
    icon: Wand,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "October 2025",
    rating: 4.6,
    version: "0.7.9"
  },
  {
    id: 42,
    name: "PhotoEnhancer",
    description: "AI-powered photo editing tool that automatically enhances images, removes unwanted elements, and applies professional-grade effects.",
    category: "AI",
    icon: Camera,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "July 2025",
    rating: 4.8,
    version: "0.9.2"
  },
  {
    id: 43,
    name: "AITutor",
    description: "Personalized learning assistant that adapts to your learning style with interactive explanations and custom practice problems.",
    category: "AI",
    icon: Brain,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "August 2025",
    rating: 4.7,
    version: "0.8.4"
  },
  {
    id: 44,
    name: "BioMedAI",
    description: "Medical information assistant that provides evidence-based health information, symptom analysis, and research updates from trusted sources.",
    category: "AI",
    icon: Shield,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "September 2025",
    rating: 4.9,
    version: "0.9.0"
  },
  {
    id: 45,
    name: "AIComposer",
    description: "Create original music and sound compositions with AI that can match specific moods, genres, or complement your visual content.",
    category: "AI",
    icon: Music,
    iconBg: iconBackgrounds[2],
    estimatedRelease: "November 2025",
    rating: 4.7,
    version: "0.8.1"
  },
  {
    id: 46,
    name: "SmartChat",
    description: "Customizable AI chatbot platform to create personalized assistants for customer support, research, productivity, or entertainment.",
    category: "AI",
    icon: MessageSquare,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "June 2025",
    rating: 4.9,
    version: "0.9.8"
  },
  {
    id: 47,
    name: "VideoDirector",
    description: "AI video creation tool that transforms text scripts into fully animated videos with custom scenes, characters, and voiceovers.",
    category: "AI",
    icon: Video,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "October 2025",
    rating: 4.6,
    version: "0.7.5"
  },
  {
    id: 48,
    name: "PromptPerfect",
    description: "Advanced prompt engineering tool that optimizes your AI interactions with suggested improvements and templates for better results.",
    category: "AI",
    icon: Sparkles,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "July 2025",
    rating: 4.8,
    version: "0.8.9"
  },
  {
    id: 49,
    name: "CodeReviewer",
    description: "AI code reviewer that analyzes your code for security vulnerabilities, performance issues, and suggests best practice improvements.",
    category: "AI",
    icon: ShieldCheck,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "August 2025",
    rating: 4.7,
    version: "0.8.3"
  },
  {
    id: 50,
    name: "AIWorkflow",
    description: "Create custom AI automation workflows combining multiple AI models and tools with drag-and-drop simplicity for complex tasks.",
    category: "AI",
    icon: Settings,
    iconBg: iconBackgrounds[3],
    estimatedRelease: "September 2025",
    rating: 4.9,
    version: "0.9.3"
  },
];

const ExtensionCard: React.FC<{ extension: ConceptualExtensionProps }> = ({ extension }) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { name, description, category, icon: Icon, iconBg, estimatedRelease, rating, version } = extension;
  
  const handleInstallClick = () => {
    setIsInstalled(!isInstalled);
    toast({
      title: isInstalled ? "Extension uninstalled" : "Extension installed",
      description: isInstalled 
        ? `${name} has been removed from your browser` 
        : `${name} has been added to your browser`,
    });
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${name} has been removed from your favorites` 
        : `${name} has been added to your favorites`,
    });
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md bg-[#191823] border border-[#433E56] ${isFavorite ? 'border-nexus-purple bg-gradient-to-br from-nexus-purple/5 to-transparent' : ''}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`h-12 w-12 rounded-md flex items-center justify-center ${iconBg}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg line-clamp-1 text-white">{name}</h3>
              <div className="text-xs text-gray-400">v{version} (Beta)</div>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="text-gray-400 hover:text-nexus-purple transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-[#9271FF] text-[#9271FF]' : ''}`} 
            />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-400 line-clamp-3 h-[4.5rem] mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-[#24212F] text-gray-300 border-[#433E56]">
            {category}
          </Badge>
          <div className="flex items-center text-sm text-gray-300">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleInstallClick}
          className={`w-full ${isInstalled ? "bg-[#24212F] hover:bg-[#24212F]/80 text-gray-300 border border-[#433E56]" : "bg-[#9271FF] hover:bg-[#9271FF]/90 text-white"}`}
          variant={isInstalled ? "outline" : "default"}
        >
          {isInstalled ? "Uninstall" : "Install Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ConceptualExtensions: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conceptualExtensions.map((extension) => (
          <ExtensionCard key={extension.id} extension={extension} />
        ))}
      </div>
    </div>
  );
};

export default ConceptualExtensions;
