
import { LucideIcon } from "lucide-react";
import { 
  Search, FileText, Globe, Video, Image, Zap, 
  Plane, Brain, Camera, Heart, Bitcoin, DollarSign, GraduationCap, 
  Code, Laptop, Cloud, Earth, Leaf, Music, Car, Truck, Database,
  PiggyBank, Rocket, Webcam, Dna, Stethoscope, Diamond, 
  Banknote, Solar, Lightning, Medkit
} from "lucide-react";

export interface SearchCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  prompts: SearchPrompt[];
}

export interface SearchPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export const searchCategories: SearchCategory[] = [
  {
    id: "aerospace",
    title: "Aerospace",
    description: "Explore space and aviation technology",
    icon: Plane,
    color: "bg-blue-600",
    prompts: [
      {
        id: "aerospace-1",
        title: "Space Exploration",
        description: "Learn about the latest space missions and discoveries",
        prompt: "What are the recent developments in space exploration regarding",
      },
      {
        id: "aerospace-2",
        title: "Aviation Technology",
        description: "Research advancements in aircraft design and systems",
        prompt: "Explain the latest innovations in aviation technology for",
      },
      {
        id: "aerospace-3",
        title: "Satellite Systems",
        description: "Information about satellite technologies and applications",
        prompt: "How are satellites being used for",
      },
      {
        id: "aerospace-4",
        title: "Rocket Propulsion",
        description: "Technical details about rocket engines and propulsion",
        prompt: "What are the advances in rocket propulsion systems for",
      },
      {
        id: "aerospace-5",
        title: "Defense Applications",
        description: "Military and defense uses of aerospace technology",
        prompt: "How is aerospace technology applied in defense systems for",
      },
      {
        id: "aerospace-6",
        title: "Commercial Space",
        description: "Information about the commercial space industry",
        prompt: "What are the business opportunities in space industry regarding",
      }
    ]
  },
  {
    id: "ai",
    title: "AI",
    description: "Artificial intelligence research and applications",
    icon: Brain,
    color: "bg-purple-600",
    prompts: [
      {
        id: "ai-1",
        title: "Machine Learning",
        description: "Information about ML algorithms and applications",
        prompt: "Explain how machine learning is being used for",
      },
      {
        id: "ai-2",
        title: "Neural Networks",
        description: "Technical details about neural network architectures",
        prompt: "How do neural networks approach problems in",
      },
      {
        id: "ai-3",
        title: "Natural Language Processing",
        description: "NLP technologies and implementations",
        prompt: "What are the latest advancements in NLP for",
      },
      {
        id: "ai-4",
        title: "Computer Vision",
        description: "AI systems that process and analyze visual data",
        prompt: "How is computer vision transforming",
      },
      {
        id: "ai-5",
        title: "AI Ethics",
        description: "Ethical considerations in AI development",
        prompt: "What are the ethical concerns surrounding AI in",
      },
      {
        id: "ai-6",
        title: "AI Research",
        description: "Current research trends and breakthroughs",
        prompt: "What are researchers discovering about AI for",
      }
    ]
  },
  {
    id: "arvr",
    title: "AR/VR",
    description: "Augmented and virtual reality technologies",
    icon: Webcam,
    color: "bg-indigo-500",
    prompts: [
      {
        id: "arvr-1",
        title: "VR Applications",
        description: "Virtual reality use cases across industries",
        prompt: "How is virtual reality being applied in",
      },
      {
        id: "arvr-2",
        title: "AR Development",
        description: "Tools and frameworks for augmented reality",
        prompt: "What technologies enable augmented reality for",
      },
      {
        id: "arvr-3",
        title: "Mixed Reality",
        description: "Blending physical and digital environments",
        prompt: "How is mixed reality changing the way we",
      },
      {
        id: "arvr-4",
        title: "Immersive Experiences",
        description: "Creating engaging VR/AR experiences",
        prompt: "What makes immersive experiences effective for",
      },
      {
        id: "arvr-5",
        title: "Hardware Innovations",
        description: "Latest AR/VR devices and equipment",
        prompt: "What are the latest hardware innovations in AR/VR for",
      },
      {
        id: "arvr-6",
        title: "Extended Reality (XR)",
        description: "The convergence of AR, VR and MR technologies",
        prompt: "How is extended reality (XR) transforming",
      }
    ]
  },
  {
    id: "biotech",
    title: "Biotech",
    description: "Biological technology and innovation",
    icon: Dna,
    color: "bg-green-600",
    prompts: [
      {
        id: "biotech-1",
        title: "Genomics",
        description: "Gene sequencing and genetic technology",
        prompt: "What are the latest developments in genomics for",
      },
      {
        id: "biotech-2",
        title: "Biopharmaceuticals",
        description: "Biological medical products and therapies",
        prompt: "How are biopharmaceuticals advancing treatment for",
      },
      {
        id: "biotech-3",
        title: "Synthetic Biology",
        description: "Engineering biological components and systems",
        prompt: "What innovations in synthetic biology are addressing",
      },
      {
        id: "biotech-4",
        title: "CRISPR Technology",
        description: "Gene editing applications and research",
        prompt: "How is CRISPR technology being used to address",
      },
      {
        id: "biotech-5",
        title: "Agricultural Biotech",
        description: "Biotechnology in farming and agriculture",
        prompt: "What biotech solutions are improving agriculture for",
      },
      {
        id: "biotech-6",
        title: "Bioinformatics",
        description: "Computational analysis of biological data",
        prompt: "How is bioinformatics accelerating research on",
      }
    ]
  },
  {
    id: "blockchain",
    title: "Blockchain",
    description: "Decentralized ledger technologies",
    icon: Database,
    color: "bg-blue-500",
    prompts: [
      {
        id: "blockchain-1",
        title: "Distributed Ledgers",
        description: "Core technology behind blockchain systems",
        prompt: "Explain how distributed ledger technology is used for",
      },
      {
        id: "blockchain-2",
        title: "Smart Contracts",
        description: "Self-executing contracts with code",
        prompt: "How can smart contracts revolutionize",
      },
      {
        id: "blockchain-3",
        title: "Enterprise Blockchain",
        description: "Blockchain solutions for businesses",
        prompt: "What are the enterprise applications of blockchain in",
      },
      {
        id: "blockchain-4",
        title: "Blockchain Security",
        description: "Security aspects of blockchain technology",
        prompt: "What security measures protect blockchain systems for",
      },
      {
        id: "blockchain-5",
        title: "Consensus Mechanisms",
        description: "Methods for achieving agreement in blockchain networks",
        prompt: "Compare consensus mechanisms for blockchain in",
      },
      {
        id: "blockchain-6",
        title: "Blockchain Scalability",
        description: "Solutions for blockchain performance issues",
        prompt: "What approaches address blockchain scalability for",
      }
    ]
  },
  {
    id: "crypto",
    title: "Crypto",
    description: "Cryptocurrency and digital assets",
    icon: Bitcoin,
    color: "bg-amber-500",
    prompts: [
      {
        id: "crypto-1",
        title: "Digital Currencies",
        description: "Information about major cryptocurrencies",
        prompt: "What are the key features and developments of",
      },
      {
        id: "crypto-2",
        title: "Crypto Markets",
        description: "Market trends and trading information",
        prompt: "Analyze the cryptocurrency market trends for",
      },
      {
        id: "crypto-3",
        title: "DeFi",
        description: "Decentralized finance platforms and protocols",
        prompt: "How is DeFi transforming financial services through",
      },
      {
        id: "crypto-4",
        title: "Tokenomics",
        description: "Economic models for cryptocurrency tokens",
        prompt: "Explain the tokenomics behind",
      },
      {
        id: "crypto-5",
        title: "Crypto Regulation",
        description: "Regulatory developments affecting cryptocurrencies",
        prompt: "What are the regulatory approaches to cryptocurrency in",
      },
      {
        id: "crypto-6",
        title: "Mining & Staking",
        description: "Processes for validating transactions",
        prompt: "Compare mining and staking mechanisms for",
      }
    ]
  },
  {
    id: "cybersecurity",
    title: "Cyber Security",
    description: "Digital security and threat protection",
    icon: Shield,
    color: "bg-red-600",
    prompts: [
      {
        id: "cybersecurity-1",
        title: "Threat Detection",
        description: "Identifying and responding to security threats",
        prompt: "What are the current approaches to detecting",
      },
      {
        id: "cybersecurity-2",
        title: "Network Security",
        description: "Protecting network infrastructure",
        prompt: "How can organizations secure networks against",
      },
      {
        id: "cybersecurity-3",
        title: "Zero Trust",
        description: "Security models that require verification from everyone",
        prompt: "Explain zero trust architecture for protecting against",
      },
      {
        id: "cybersecurity-4",
        title: "Ransomware Protection",
        description: "Defending against ransomware attacks",
        prompt: "What strategies prevent and mitigate ransomware attacks on",
      },
      {
        id: "cybersecurity-5",
        title: "Data Privacy",
        description: "Protecting sensitive information",
        prompt: "How can organizations ensure data privacy while",
      },
      {
        id: "cybersecurity-6",
        title: "Secure Development",
        description: "Building security into software development",
        prompt: "What practices enable secure development of",
      }
    ]
  },
  {
    id: "fintech",
    title: "Fintech",
    description: "Financial technology innovation",
    icon: PiggyBank,
    color: "bg-green-500",
    prompts: [
      {
        id: "fintech-1",
        title: "Payment Systems",
        description: "Digital payment technologies and platforms",
        prompt: "What innovations are transforming payment systems for",
      },
      {
        id: "fintech-2",
        title: "Digital Banking",
        description: "Online and mobile banking solutions",
        prompt: "How is digital banking changing financial services through",
      },
      {
        id: "fintech-3",
        title: "Insurtech",
        description: "Technology for the insurance industry",
        prompt: "What insurtech solutions address challenges in",
      },
      {
        id: "fintech-4",
        title: "Regtech",
        description: "Technology for regulatory compliance",
        prompt: "How is regtech helping financial institutions comply with",
      },
      {
        id: "fintech-5",
        title: "Wealth Management",
        description: "Digital tools for investment and portfolio management",
        prompt: "What fintech approaches are transforming wealth management for",
      },
      {
        id: "fintech-6",
        title: "Financial Inclusion",
        description: "Expanding access to financial services",
        prompt: "How is fintech promoting financial inclusion for",
      }
    ]
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Medical technology and health services",
    icon: Stethoscope,
    color: "bg-blue-400",
    prompts: [
      {
        id: "healthcare-1",
        title: "Digital Health",
        description: "Technology-enabled healthcare services",
        prompt: "What digital health solutions are improving care for",
      },
      {
        id: "healthcare-2",
        title: "Telemedicine",
        description: "Remote healthcare delivery",
        prompt: "How is telemedicine transforming access to",
      },
      {
        id: "healthcare-3",
        title: "Health Data",
        description: "Managing and analyzing patient information",
        prompt: "What approaches to health data are enhancing",
      },
      {
        id: "healthcare-4",
        title: "Medical Devices",
        description: "Technologies for diagnosis and treatment",
        prompt: "What innovations in medical devices are addressing",
      },
      {
        id: "healthcare-5",
        title: "Healthcare AI",
        description: "Artificial intelligence in healthcare",
        prompt: "How is AI being applied in healthcare to improve",
      },
      {
        id: "healthcare-6",
        title: "Personalized Medicine",
        description: "Tailoring medical care to individual patients",
        prompt: "What advances in personalized medicine are helping patients with",
      }
    ]
  },
  {
    id: "sustainability",
    title: "Cleantech",
    description: "Sustainable technology solutions",
    icon: Leaf,
    color: "bg-green-400",
    prompts: [
      {
        id: "sustainability-1",
        title: "Renewable Energy",
        description: "Technologies for clean energy production",
        prompt: "What renewable energy technologies are advancing for",
      },
      {
        id: "sustainability-2",
        title: "Carbon Capture",
        description: "Methods for capturing and storing CO2",
        prompt: "How are carbon capture technologies addressing",
      },
      {
        id: "sustainability-3",
        title: "Sustainable Materials",
        description: "Environmentally friendly material alternatives",
        prompt: "What sustainable materials are replacing traditional ones in",
      },
      {
        id: "sustainability-4",
        title: "Green Buildings",
        description: "Energy-efficient construction and design",
        prompt: "What green building technologies reduce environmental impact of",
      },
      {
        id: "sustainability-5",
        title: "Water Technology",
        description: "Solutions for water conservation and treatment",
        prompt: "What water technologies are solving challenges in",
      },
      {
        id: "sustainability-6",
        title: "Circular Economy",
        description: "Systems that eliminate waste and pollution",
        prompt: "How is the circular economy transforming",
      }
    ]
  },
  {
    id: "education",
    title: "EdTech",
    description: "Educational technology and innovation",
    icon: GraduationCap,
    color: "bg-blue-300",
    prompts: [
      {
        id: "education-1",
        title: "Online Learning",
        description: "Digital platforms for education",
        prompt: "What innovations in online learning are improving",
      },
      {
        id: "education-2",
        title: "Learning Analytics",
        description: "Data-driven approaches to education",
        prompt: "How is learning analytics enhancing outcomes in",
      },
      {
        id: "education-3",
        title: "Educational Games",
        description: "Game-based learning approaches",
        prompt: "What educational games are effectively teaching",
      },
      {
        id: "education-4",
        title: "Adaptive Learning",
        description: "Personalized education technologies",
        prompt: "How is adaptive learning technology personalizing education for",
      },
      {
        id: "education-5",
        title: "VR in Education",
        description: "Virtual reality for learning",
        prompt: "How is virtual reality enhancing education in",
      },
      {
        id: "education-6",
        title: "STEM Education",
        description: "Technology for science and math learning",
        prompt: "What technologies are advancing STEM education for",
      }
    ]
  },
  {
    id: "realestate",
    title: "Real Estate",
    description: "Property technology and innovation",
    icon: Home,
    color: "bg-amber-400",
    prompts: [
      {
        id: "realestate-1",
        title: "Proptech",
        description: "Technology for real estate industry",
        prompt: "What proptech solutions are transforming",
      },
      {
        id: "realestate-2",
        title: "Smart Buildings",
        description: "Intelligent building management systems",
        prompt: "How are smart building technologies enhancing",
      },
      {
        id: "realestate-3",
        title: "Virtual Tours",
        description: "Digital property viewing experiences",
        prompt: "What virtual tour technologies are changing how people view",
      },
      {
        id: "realestate-4",
        title: "Real Estate Analytics",
        description: "Data insights for property markets",
        prompt: "How is data analytics improving decision-making in",
      },
      {
        id: "realestate-5",
        title: "Property Management",
        description: "Technology for maintaining properties",
        prompt: "What technologies are streamlining property management for",
      },
      {
        id: "realestate-6",
        title: "Construction Tech",
        description: "Innovation in building construction",
        prompt: "What construction technologies are advancing",
      }
    ]
  },
  {
    id: "energy",
    title: "Energy",
    description: "Power generation and distribution",
    icon: Lightning,
    color: "bg-yellow-500",
    prompts: [
      {
        id: "energy-1",
        title: "Renewable Sources",
        description: "Clean energy production technologies",
        prompt: "What innovations are improving renewable energy from",
      },
      {
        id: "energy-2",
        title: "Energy Storage",
        description: "Battery and other storage technologies",
        prompt: "What energy storage solutions address challenges in",
      },
      {
        id: "energy-3",
        title: "Smart Grid",
        description: "Intelligent electricity distribution",
        prompt: "How are smart grid technologies optimizing",
      },
      {
        id: "energy-4",
        title: "Energy Efficiency",
        description: "Reducing energy consumption",
        prompt: "What approaches improve energy efficiency in",
      },
      {
        id: "energy-5",
        title: "Hydrogen Energy",
        description: "Hydrogen as a fuel source",
        prompt: "How is hydrogen energy technology advancing for",
      },
      {
        id: "energy-6",
        title: "Nuclear Innovation",
        description: "Advances in nuclear energy",
        prompt: "What new nuclear technologies address concerns about",
      }
    ]
  },
  {
    id: "quantum",
    title: "Quantum",
    description: "Quantum computing and applications",
    icon: Zap,
    color: "bg-purple-400",
    prompts: [
      {
        id: "quantum-1",
        title: "Quantum Computing",
        description: "Information processing using quantum mechanics",
        prompt: "What are the latest developments in quantum computing for",
      },
      {
        id: "quantum-2",
        title: "Quantum Security",
        description: "Cryptography in the quantum era",
        prompt: "How will quantum technologies affect security in",
      },
      {
        id: "quantum-3",
        title: "Quantum Software",
        description: "Programming for quantum computers",
        prompt: "What quantum software approaches enable",
      },
      {
        id: "quantum-4",
        title: "Quantum Sensors",
        description: "Ultra-precise measurement devices",
        prompt: "How are quantum sensors revolutionizing measurement in",
      },
      {
        id: "quantum-5",
        title: "Industry Applications",
        description: "Quantum technology in specific industries",
        prompt: "What quantum computing applications will transform",
      },
      {
        id: "quantum-6",
        title: "Quantum Research",
        description: "Scientific advances in quantum physics",
        prompt: "What breakthroughs in quantum research might enable",
      }
    ]
  },
  {
    id: "web3",
    title: "Web3",
    description: "Decentralized internet technologies",
    icon: Globe,
    color: "bg-indigo-400",
    prompts: [
      {
        id: "web3-1",
        title: "Decentralized Apps",
        description: "Applications built on blockchain",
        prompt: "How are decentralized applications (dApps) transforming",
      },
      {
        id: "web3-2",
        title: "NFTs",
        description: "Non-fungible tokens and digital ownership",
        prompt: "What innovations in NFTs are changing",
      },
      {
        id: "web3-3",
        title: "DAOs",
        description: "Decentralized autonomous organizations",
        prompt: "How are DAOs reimagining organizational structures for",
      },
      {
        id: "web3-4",
        title: "Digital Identity",
        description: "Self-sovereign identity solutions",
        prompt: "What Web3 approaches to digital identity solve problems in",
      },
      {
        id: "web3-5",
        title: "Metaverse",
        description: "Immersive digital worlds and economies",
        prompt: "How is the metaverse concept evolving to support",
      },
      {
        id: "web3-6",
        title: "Web3 Infrastructure",
        description: "Foundational technologies for decentralized web",
        prompt: "What infrastructure technologies enable Web3 for",
      }
    ]
  },
  {
    id: "saas",
    title: "SaaS",
    description: "Software-as-a-Service businesses",
    icon: Laptop,
    color: "bg-blue-500",
    prompts: [
      {
        id: "saas-1",
        title: "SaaS Models",
        description: "Business models for software services",
        prompt: "What SaaS business models are most effective for",
      },
      {
        id: "saas-2",
        title: "Enterprise SaaS",
        description: "Software services for large organizations",
        prompt: "How is enterprise SaaS transforming operations in",
      },
      {
        id: "saas-3",
        title: "SaaS Integration",
        description: "Connecting software services",
        prompt: "What integration approaches improve SaaS ecosystems for",
      },
      {
        id: "saas-4",
        title: "SaaS Security",
        description: "Protecting cloud-based services",
        prompt: "What security practices are essential for SaaS in",
      },
      {
        id: "saas-5",
        title: "SaaS Architecture",
        description: "Technical design of software services",
        prompt: "What architectural patterns optimize SaaS for",
      },
      {
        id: "saas-6",
        title: "SaaS Analytics",
        description: "Metrics and data for software services",
        prompt: "How can SaaS companies use analytics to improve",
      }
    ]
  },
  {
    id: "nexus",
    title: "Nexus AI",
    description: "Advanced AI-powered search capabilities",
    icon: Search,
    color: "bg-nexus-purple",
    prompts: [
      {
        id: "nexus-1",
        title: "Data Analysis",
        description: "Analyze data and provide insights",
        prompt: "Analyze these statistics about",
      },
      {
        id: "nexus-2",
        title: "Creative Writing",
        description: "Generate creative content",
        prompt: "Write a creative piece about",
      },
      {
        id: "nexus-3",
        title: "Trend Analysis",
        description: "Analyze and explain current trends",
        prompt: "What are the current trends in",
      },
      {
        id: "nexus-4",
        title: "Complex Questions",
        description: "Get answers to complex questions",
        prompt: "I need a detailed explanation of",
      },
      {
        id: "nexus-5",
        title: "Predictions",
        description: "Get predictions based on data",
        prompt: "What might happen with",
      },
      {
        id: "nexus-6",
        title: "Research Assistant",
        description: "Get help with research",
        prompt: "Help me research",
      },
    ]
  }
];

export const getCategoryById = (id: string): SearchCategory | undefined => {
  return searchCategories.find(category => category.id === id);
};
