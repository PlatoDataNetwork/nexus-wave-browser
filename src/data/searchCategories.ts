import { 
  Rocket, 
  Brain, 
  Glasses, 
  Car, 
  PlaneTakeoff,
  Building2, 
  BarChart4,
  Dna, 
  Bitcoin, 
  Leaf,
  Stethoscope, 
  Activity,
  Database,
  Workflow,
  Code,
  Users,
  School,
  ShoppingCart,
  Lightbulb,
  Zap,
  Trophy,
  PieChart,
  Newspaper,
  Wallet,
  TrendingUp,
  Gamepad2,
  CircuitBoard,
  Music,
  Microscope,
  Image,
  Gavel,
  CreditCard,
  BadgeDollarSign,
  Footprints,
  Atom,
  Home,
  LineChart,
  Binary,
  Search,
  SunMedium,
  Presentation,
  Layers,
  FlaskConical,
  Truck,
  ArrowUpDown,
  BadgePercent,
  Trash2,
  Globe,
  type LucideIcon
} from "lucide-react";

import { getCategoryById } from "@/utils/categoryUtils";

export interface SearchPrompt {
  id: string;
  title: string;
  prompt: string;
}

export interface SearchCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  prompts: SearchPrompt[];
}

// Function to get a category by ID
export const getCategoryById = (id: string): SearchCategory | undefined => {
  return searchCategories.find(category => category.id === id);
};

// Define all search categories
export const searchCategories: SearchCategory[] = [
  {
    id: "aerospace",
    title: "Aerospace",
    description: "Space exploration and aerospace technology",
    icon: Rocket,
    color: "bg-blue-600",
    prompts: [
      { id: "aerospace-1", title: "Space Tech Innovations", prompt: "What are the latest innovations in space technology?" },
      { id: "aerospace-2", title: "Satellite Systems", prompt: "Explain how satellite communication systems work" },
      { id: "aerospace-3", title: "Space Missions", prompt: "What are the upcoming space missions in the next 5 years?" },
      { id: "aerospace-4", title: "Aerospace Materials", prompt: "What advanced materials are used in aerospace engineering?" },
      { id: "aerospace-5", title: "Propulsion Systems", prompt: "Compare different spacecraft propulsion systems" },
      { id: "aerospace-6", title: "Space Industry", prompt: "How is the commercial space industry evolving?" }
    ]
  },
  {
    id: "ai",
    title: "AI",
    description: "Artificial intelligence and machine learning",
    icon: Brain,
    color: "bg-purple-600",
    prompts: [
      { id: "ai-1", title: "AI Ethics", prompt: "What are the key ethical considerations in AI development?" },
      { id: "ai-2", title: "Machine Learning", prompt: "Explain the difference between supervised and unsupervised learning" },
      { id: "ai-3", title: "Neural Networks", prompt: "How do neural networks mimic human brain function?" },
      { id: "ai-4", title: "AI Applications", prompt: "What are practical applications of AI in healthcare?" },
      { id: "ai-5", title: "Future of AI", prompt: "How might AI evolve over the next decade?" },
      { id: "ai-6", title: "AI Limitations", prompt: "What are the current limitations of artificial intelligence?" }
    ]
  },
  {
    id: "arvr",
    title: "AR/VR",
    description: "Augmented and virtual reality technologies",
    icon: Glasses,
    color: "bg-indigo-500",
    prompts: [
      { id: "arvr-1", title: "VR Applications", prompt: "What are innovative applications of virtual reality beyond gaming?" },
      { id: "arvr-2", title: "AR Technology", prompt: "How does augmented reality technology work?" },
      { id: "arvr-3", title: "Mixed Reality", prompt: "What is mixed reality and how does it differ from AR and VR?" },
      { id: "arvr-4", title: "Immersive Learning", prompt: "How is VR being used in education and training?" },
      { id: "arvr-5", title: "Hardware Trends", prompt: "What are the latest trends in AR/VR hardware?" },
      { id: "arvr-6", title: "Future Developments", prompt: "How might AR/VR reshape human-computer interaction?" }
    ]
  },
  {
    id: "automotive",
    title: "Automotive",
    description: "Automotive industry and vehicle technology",
    icon: Car,
    color: "bg-red-600",
    prompts: [
      { id: "auto-1", title: "Electric Vehicles", prompt: "Compare the latest electric vehicle technologies" },
      { id: "auto-2", title: "Autonomous Driving", prompt: "What are the levels of autonomous driving technology?" },
      { id: "auto-3", title: "Battery Technology", prompt: "How are EV batteries evolving for longer range?" },
      { id: "auto-4", title: "Sustainability", prompt: "How is the automotive industry addressing sustainability?" },
      { id: "auto-5", title: "Connected Cars", prompt: "What are the features of connected car technology?" },
      { id: "auto-6", title: "Market Trends", prompt: "What are current trends in the global automotive market?" }
    ]
  },
  {
    id: "aviation",
    title: "Aviation",
    description: "Aircraft and aviation industry",
    icon: PlaneTakeoff,
    color: "bg-blue-400",
    prompts: [
      { id: "aviation-1", title: "Commercial Aviation", prompt: "What are recent developments in commercial aviation?" },
      { id: "aviation-2", title: "Electric Aircraft", prompt: "How are electric aircraft developing?" },
      { id: "aviation-3", title: "Aviation Safety", prompt: "What technologies are improving aviation safety?" },
      { id: "aviation-4", title: "Air Traffic Control", prompt: "How is air traffic control being modernized?" },
      { id: "aviation-5", title: "Sustainable Aviation", prompt: "What are sustainable aviation fuel alternatives?" },
      { id: "aviation-6", title: "Future of Flight", prompt: "How might commercial air travel change in the next 20 years?" }
    ]
  },
  {
    id: "banking",
    title: "Banking",
    description: "Banking industry and financial services",
    icon: Building2,
    color: "bg-emerald-700",
    prompts: [
      { id: "banking-1", title: "Digital Banking", prompt: "How is digital banking transforming the industry?" },
      { id: "banking-2", title: "Open Banking", prompt: "What is open banking and its implications?" },
      { id: "banking-3", title: "Banking Security", prompt: "What cybersecurity challenges do banks face?" },
      { id: "banking-4", title: "Central Banks", prompt: "How do central banks influence national economies?" },
      { id: "banking-5", title: "Banking Regulations", prompt: "What are key global banking regulations?" },
      { id: "banking-6", title: "Future of Banking", prompt: "How might banking evolve in the next decade?" }
    ]
  },
  {
    id: "bigdata",
    title: "Big Data",
    description: "Big data analytics and management",
    icon: BarChart4,
    color: "bg-blue-800",
    prompts: [
      { id: "bigdata-1", title: "Data Analytics", prompt: "What are advanced techniques in big data analytics?" },
      { id: "bigdata-2", title: "Data Storage", prompt: "Compare different big data storage solutions" },
      { id: "bigdata-3", title: "Data Privacy", prompt: "How do organizations balance data utility with privacy?" },
      { id: "bigdata-4", title: "Real-time Processing", prompt: "What technologies enable real-time data processing?" },
      { id: "bigdata-5", title: "Industry Applications", prompt: "How is big data transforming healthcare?" },
      { id: "bigdata-6", title: "Future Trends", prompt: "What emerging trends will shape big data in the next 5 years?" }
    ]
  },
  {
    id: "biotech",
    title: "Biotech",
    description: "Biotechnology and genetic engineering",
    icon: Dna,
    color: "bg-green-600",
    prompts: [
      { id: "biotech-1", title: "CRISPR Technology", prompt: "Explain how CRISPR gene editing works" },
      { id: "biotech-2", title: "Synthetic Biology", prompt: "What are applications of synthetic biology?" },
      { id: "biotech-3", title: "Biotech in Medicine", prompt: "How is biotechnology revolutionizing medicine?" },
      { id: "biotech-4", title: "Agricultural Biotech", prompt: "What are the benefits and concerns of GMO crops?" },
      { id: "biotech-5", title: "Bio-manufacturing", prompt: "How are biologics manufactured at scale?" },
      { id: "biotech-6", title: "Ethical Concerns", prompt: "What are ethical challenges in biotechnology?" }
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
    id: "cannabis",
    title: "Cannabis",
    description: "Cannabis industry and medical research",
    icon: Leaf,
    color: "bg-green-500",
    prompts: [
      {
        id: "cannabis-1",
        title: "Medical Research",
        description: "Medical applications of cannabis",
        prompt: "What does research reveal about medical applications of cannabis for",
      },
      {
        id: "cannabis-2",
        title: "Industry Growth",
        description: "Business trends in the cannabis sector",
        prompt: "How is the legal cannabis industry evolving in response to",
      },
      {
        id: "cannabis-3",
        title: "Regulation",
        description: "Legal frameworks for cannabis",
        prompt: "What regulatory approaches are governments taking toward cannabis for",
      },
      {
        id: "cannabis-4",
        title: "CBD Products",
        description: "Non-psychoactive cannabis derivatives",
        prompt: "How are CBD products being used to address",
      },
      {
        id: "cannabis-5",
        title: "Cultivation Technology",
        description: "Growing and processing innovations",
        prompt: "What technological innovations are improving cannabis cultivation for",
      },
      {
        id: "cannabis-6",
        title: "Market Trends",
        description: "Consumer and product trends",
        prompt: "What trends are emerging in the cannabis market related to",
      }
    ]
  },
  {
    id: "carbon",
    title: "Carbon",
    description: "Carbon management and climate technology",
    icon: Cloud,
    color: "bg-gray-600",
    prompts: [
      {
        id: "carbon-1",
        title: "Carbon Capture",
        description: "Technologies to remove CO2",
        prompt: "What carbon capture technologies are being developed to address",
      },
      {
        id: "carbon-2",
        title: "Carbon Markets",
        description: "Trading and pricing carbon emissions",
        prompt: "How are carbon markets evolving to incentivize",
      },
      {
        id: "carbon-3",
        title: "Carbon Footprint",
        description: "Measuring and reducing emissions",
        prompt: "What methods effectively reduce carbon footprints for",
      },
      {
        id: "carbon-4",
        title: "Carbon Neutrality",
        description: "Achieving net-zero emissions",
        prompt: "How are organizations achieving carbon neutrality while",
      },
      {
        id: "carbon-5",
        title: "Carbon Policy",
        description: "Government approaches to carbon",
        prompt: "What policy frameworks are most effective for reducing carbon emissions in",
      },
      {
        id: "carbon-6",
        title: "Carbon Technology",
        description: "Innovations in carbon management",
        prompt: "Which technologies show promise for addressing carbon challenges in",
      }
    ]
  },
  {
    id: "cleantech",
    title: "Cleantech",
    description: "Sustainable technology solutions",
    icon: Leaf,
    color: "bg-green-400",
    prompts: [
      {
        id: "cleantech-1",
        title: "Renewable Energy",
        description: "Technologies for clean energy production",
        prompt: "What renewable energy technologies are advancing for",
      },
      {
        id: "cleantech-2",
        title: "Carbon Capture",
        description: "Methods for capturing and storing CO2",
        prompt: "How are carbon capture technologies addressing",
      },
      {
        id: "cleantech-3",
        title: "Sustainable Materials",
        description: "Environmentally friendly material alternatives",
        prompt: "What sustainable materials are replacing traditional ones in",
      },
      {
        id: "cleantech-4",
        title: "Green Buildings",
        description: "Energy-efficient construction and design",
        prompt: "What green building technologies reduce environmental impact of",
      },
      {
        id: "cleantech-5",
        title: "Water Technology",
        description: "Solutions for water conservation and treatment",
        prompt: "What water technologies are solving challenges in",
      },
      {
        id: "cleantech-6",
        title: "Circular Economy",
        description: "Systems that eliminate waste and pollution",
        prompt: "How is the circular economy transforming",
      }
    ]
  },
  {
    id: "clinicaltrials",
    title: "Clinical Trials",
    description: "Medical research and drug testing",
    icon: FlaskConical,
    color: "bg-cyan-500",
    prompts: [
      {
        id: "clinicaltrials-1",
        title: "Trial Design",
        description: "Structuring effective clinical studies",
        prompt: "What are best practices in clinical trial design for",
      },
      {
        id: "clinicaltrials-2",
        title: "Patient Recruitment",
        description: "Finding participants for studies",
        prompt: "How can patient recruitment be improved for clinical trials studying",
      },
      {
        id: "clinicaltrials-3",
        title: "Data Collection",
        description: "Gathering and managing trial data",
        prompt: "What data collection methods enhance clinical trials for",
      },
      {
        id: "clinicaltrials-4",
        title: "Regulatory Approval",
        description: "Navigating approval processes",
        prompt: "What regulatory considerations impact clinical trials for",
      },
      {
        id: "clinicaltrials-5",
        title: "Trial Technology",
        description: "Tech innovations in clinical research",
        prompt: "How is technology improving clinical trials studying",
      },
      {
        id: "clinicaltrials-6",
        title: "Trial Results",
        description: "Analyzing and reporting outcomes",
        prompt: "What approaches improve analysis of clinical trial results for",
      }
    ]
  },
  {
    id: "code",
    title: "Code",
    description: "Programming and software development",
    icon: FileCode,
    color: "bg-indigo-600",
    prompts: [
      {
        id: "code-1",
        title: "Programming Languages",
        description: "Features and applications of languages",
        prompt: "What are the advantages of using specific programming languages for",
      },
      {
        id: "code-2",
        title: "Software Development",
        description: "Methods and practices for coding",
        prompt: "What development methodologies are effective for building",
      },
      {
        id: "code-3",
        title: "DevOps",
        description: "Development and operations integration",
        prompt: "How can DevOps practices improve development of",
      },
      {
        id: "code-4",
        title: "Code Quality",
        description: "Writing and maintaining good code",
        prompt: "What practices ensure high quality code when developing",
      },
      {
        id: "code-5",
        title: "Frameworks",
        description: "Software frameworks and libraries",
        prompt: "Which frameworks are best suited for developing",
      },
      {
        id: "code-6",
        title: "Testing",
        description: "Validating software functionality",
        prompt: "What testing approaches are most effective for",
      }
    ]
  },
  {
    id: "crowdfunding",
    title: "Crowdfunding",
    description: "Collective financing for projects and startups",
    icon: BadgeDollarSign,
    color: "bg-emerald-500",
    prompts: [
      {
        id: "crowdfunding-1",
        title: "Campaign Strategies",
        description: "Successful fundraising approaches",
        prompt: "What strategies make crowdfunding campaigns successful for",
      },
      {
        id: "crowdfunding-2",
        title: "Platforms",
        description: "Crowdfunding websites and services",
        prompt: "Which crowdfunding platforms are most suitable for",
      },
      {
        id: "crowdfunding-3",
        title: "Rewards",
        description: "Incentives for campaign backers",
        prompt: "What rewards systems work effectively for crowdfunding",
      },
      {
        id: "crowdfunding-4",
        title: "Equity Crowdfunding",
        description: "Investment-based crowdfunding",
        prompt: "How does equity crowdfunding differ from traditional funding for",
      },
      {
        id: "crowdfunding-5",
        title: "Regulations",
        description: "Legal frameworks for crowdfunding",
        prompt: "What regulations affect crowdfunding campaigns for",
      },
      {
        id: "crowdfunding-6",
        title: "Marketing",
        description: "Promoting crowdfunding campaigns",
        prompt: "What marketing strategies drive successful crowdfunding for",
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
    icon: ShieldCheck,
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
    id: "defense",
    title: "Defense",
    description: "Military technology and security systems",
    icon: ShieldCheck,
    color: "bg-slate-700",
    prompts: [
      {
        id: "defense-1",
        title: "Military Technology",
        description: "Advanced defense systems and equipment",
        prompt: "How are technological advances changing military capabilities for",
      },
      {
        id: "defense-2",
        title: "Cybersecurity",
        description: "Protecting defense digital assets",
        prompt: "What cybersecurity approaches protect defense systems from",
      },
      {
        id: "defense-3",
        title: "Intelligence Systems",
        description: "Information gathering technologies",
        prompt: "How are intelligence systems evolving to address",
      },
      {
        id: "defense-4",
        title: "Defense Innovation",
        description: "New approaches to security challenges",
        prompt: "What innovations are transforming defense capabilities for",
      },
      {
        id: "defense-5",
        title: "Security Cooperation",
        description: "International defense partnerships",
        prompt: "How do defense partnerships address shared challenges like",
      },
      {
        id: "defense-6",
        title: "Threat Response",
        description: "Countering security threats",
        prompt: "What strategies effectively counter emerging threats such as",
      }
    ]
  },
  {
    id: "ecommerce",
    title: "Ecommerce",
    description: "Online retail and digital commerce",
    icon: ShoppingCart,
    color: "bg-orange-500",
    prompts: [
      {
        id: "ecommerce-1",
        title: "Online Retail",
        description: "Digital storefront strategies",
        prompt: "What strategies improve online retail performance for",
      },
      {
        id: "ecommerce-2",
        title: "Payment Systems",
        description: "Transaction processing for online stores",
        prompt: "Which payment systems best serve ecommerce sites selling",
      },
      {
        id: "ecommerce-3",
        title: "Customer Experience",
        description: "Enhancing online shopping journeys",
        prompt: "How can ecommerce sites improve customer experience for",
      },
      {
        id: "ecommerce-4",
        title: "Marketplace Strategies",
        description: "Selling on third-party platforms",
        prompt: "What approaches succeed on marketplaces like Amazon for",
      },
      {
        id: "ecommerce-5",
        title: "Mobile Commerce",
        description: "Shopping via mobile devices",
        prompt: "How can businesses optimize mobile commerce for",
      },
      {
        id: "ecommerce-6",
        title: "Logistics",
        description: "Order fulfillment and delivery",
        prompt: "What logistics solutions improve ecommerce operations for",
      }
    ]
  },
  {
    id: "edtech",
    title: "EdTech",
    description: "Educational technology and innovation",
    icon: GraduationCap,
    color: "bg-blue-300",
    prompts: [
      {
        id: "edtech-1",
        title: "Online Learning",
        description: "Digital platforms for education",
        prompt: "What innovations in online learning are improving",
      },
      {
        id: "edtech-2",
        title: "Learning Analytics",
        description: "Data-driven approaches to education",
        prompt: "How is learning analytics enhancing outcomes in",
      },
      {
        id: "edtech-3",
        title: "Educational Games",
        description: "Game-based learning approaches",
        prompt: "What educational games are effectively teaching",
      },
      {
        id: "edtech-4",
        title: "Adaptive Learning",
        description: "Personalized education technologies",
        prompt: "How is adaptive learning technology personalizing education for",
      },
      {
        id: "edtech-5",
        title: "VR in Education",
        description: "Virtual reality for learning",
        prompt: "How is virtual reality enhancing education in",
      },
      {
        id: "edtech-6",
        title: "STEM Education",
        description: "Technology for science and math learning",
        prompt: "What technologies are advancing STEM education for",
      }
    ]
  },
  {
    id: "energy",
    title: "Energy",
    description: "Power generation and distribution",
    icon: Zap,
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
    id: "esg",
    title: "ESG",
    description: "Environmental, Social, and Governance factors",
    icon: Leaf,
    color: "bg-green-600",
    prompts: [
      {
        id: "esg-1",
        title: "ESG Investing",
        description: "Responsible investment strategies",
        prompt: "How are ESG criteria changing investment decisions for",
      },
      {
        id: "esg-2",
        title: "ESG Reporting",
        description: "Disclosure of sustainability metrics",
        prompt: "What frameworks improve ESG reporting for",
      },
      {
        id: "esg-3",
        title: "Environmental Impact",
        description: "Reducing ecological footprints",
        prompt: "What strategies effectively reduce environmental impacts of",
      },
      {
        id: "esg-4",
        title: "Social Responsibility",
        description: "Corporate social initiatives",
        prompt: "How can companies improve their social responsibility regarding",
      },
      {
        id: "esg-5",
        title: "Governance Practices",
        description: "Ethical corporate leadership",
        prompt: "What governance practices promote accountability in",
      },
      {
        id: "esg-6",
        title: "Sustainable Business",
        description: "Long-term business sustainability",
        prompt: "How can businesses align profit with sustainability for",
      }
    ]
  },
  {
    id: "esports",
    title: "Esports",
    description: "Competitive video gaming and industry",
    icon: Gamepad2,
    color: "bg-fuchsia-600",
    prompts: [
      {
        id: "esports-1",
        title: "Competitive Gaming",
        description: "Professional esports competitions",
        prompt: "How is the competitive scene evolving for esports like",
      },
      {
        id: "esports-2",
        title: "Streaming",
        description: "Live broadcasting of gameplay",
        prompt: "What streaming technologies and platforms are shaping",
      },
      {
        id: "esports-3",
        title: "Team Management",
        description: "Running professional gaming teams",
        prompt: "What approaches are effective for managing esports teams competing in",
      },
      {
        id: "esports-4",
        title: "Tournament Organization",
        description: "Creating and running gaming events",
        prompt: "How are esports tournaments organized for games like",
      },
      {
        id: "esports-5",
        title: "Esports Business",
        description: "Commercial aspects of competitive gaming",
        prompt: "What business models are successful in the esports industry for",
      },
      {
        id: "esports-6",
        title: "Gaming Technology",
        description: "Hardware for competitive gaming",
        prompt: "How is gaming technology advancing competitive play in",
      }
    ]
  },
  {
    id: "finance",
    title: "Finance",
    description: "Financial systems and investment strategies",
    icon: DollarSign,
    color: "bg-emerald-600",
    prompts: [
      {
        id: "finance-1",
        title: "Investment Strategies",
        description: "Approaches to growing capital",
        prompt: "What investment strategies are effective for",
      },
      {
        id: "finance-2",
        title: "Financial Markets",
        description: "Stock, bond, and commodity markets",
        prompt: "How are financial markets responding to",
      },
      {
        id: "finance-3",
        title: "Risk Management",
        description: "Protecting against financial losses",
        prompt: "What risk management approaches protect against",
      },
      {
        id: "finance-4",
        title: "Corporate Finance",
        description: "Business funding and capital structure",
        prompt: "How can businesses optimize their capital structure for",
      },
      {
        id: "finance-5",
        title: "Personal Finance",
        description: "Individual financial planning",
        prompt: "What strategies improve personal financial outcomes when dealing with",
      },
      {
        id: "finance-6",
        title: "Financial Analysis",
        description: "Evaluating financial performance",
        prompt: "What analysis methods provide insights into",
      }
    ]
  },
  {
    id: "financefeeds",
    title: "Finance Feeds",
    description: "Financial news and data streams",
    icon: AreaChart,
    color: "bg-blue-600",
    prompts: [
      {
        id: "financefeeds-1",
        title: "Market Data",
        description: "Real-time financial information",
        prompt: "How can market data feeds be optimized for trading",
      },
      {
        id: "financefeeds-2",
        title: "News Analysis",
        description: "Processing financial news content",
        prompt: "What methods extract actionable insights from financial news about",
      },
      {
        id: "financefeeds-3",
        title: "Data Integration",
        description: "Combining multiple financial feeds",
        prompt: "How can disparate financial data sources be integrated to analyze",
      },
      {
        id: "financefeeds-4",
        title: "Feed Technology",
        description: "Systems for financial data delivery",
        prompt: "What technologies improve delivery of financial data for",
      },
      {
        id: "financefeeds-5",
        title: "Alternative Data",
        description: "Non-traditional financial information",
        prompt: "How can alternative data feeds enhance understanding of",
      },
      {
        id: "financefeeds-6",
        title: "Feed Analytics",
        description: "Analyzing financial data streams",
        prompt: "What analytics approaches extract value from financial feeds about",
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
    id: "forex",
    title: "Forex",
    description: "Foreign exchange market and currency trading",
    icon: Banknote,
    color: "bg-blue-500",
    prompts: [
      {
        id: "forex-1",
        title: "Currency Trading",
        description: "Buying and selling currency pairs",
        prompt: "What strategies are effective for trading currency pairs like",
      },
      {
        id: "forex-2",
        title: "Market Analysis",
        description: "Evaluating forex market conditions",
        prompt: "How can traders analyze market conditions for currencies such as",
      },
      {
        id: "forex-3",
        title: "Trading Platforms",
        description: "Software for forex transactions",
        prompt: "Which trading platforms offer advantages for forex traders focusing on",
      },
      {
        id: "forex-4",
        title: "Risk Management",
        description: "Protecting forex trading capital",
        prompt: "What risk management approaches protect forex traders from",
      },
      {
        id: "forex-5",
        title: "Economic Indicators",
        description: "Data affecting currency values",
        prompt: "How do economic indicators impact currency values for",
      },
      {
        id: "forex-6",
        title: "Automated Trading",
        description: "Algorithmic forex trading systems",
        prompt: "What approaches to automated trading are effective in forex markets for",
      }
    ]
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Video games and interactive entertainment",
    icon: Gamepad2,
    color: "bg-purple-500",
    prompts: [
      {
        id: "gaming-1",
        title: "Game Development",
        description: "Creating video games",
        prompt: "What approaches are effective for developing games with",
      },
      {
        id: "gaming-2",
        title: "Gaming Hardware",
        description: "Consoles and equipment for playing",
        prompt: "How is gaming hardware evolving to support",
      },
      {
        id: "gaming-3",
        title: "Game Design",
        description: "Creating engaging play experiences",
        prompt: "What design principles create compelling experiences in games about",
      },
      {
        id: "gaming-4",
        title: "Gaming Industry",
        description: "Business aspects of video games",
        prompt: "What trends are shaping the gaming industry's approach to",
      },
      {
        id: "gaming-5",
        title: "Gaming Communities",
        description: "Player groups and social aspects",
        prompt: "How do gaming communities form and evolve around",
      },
      {
        id: "gaming-6",
        title: "Game Monetization",
        description: "Revenue models for games",
        prompt: "Which monetization approaches are effective for games focusing on",
      }
    ]
  },
  {
    id: "hydrogen",
    title: "Hydrogen",
    description: "Hydrogen energy and fuel technology",
    icon: BatteryCharging,
    color: "bg-cyan-500",
    prompts: [
      {
        id: "hydrogen-1",
        title: "Production Methods",
        description: "Creating hydrogen fuel",
        prompt: "What methods are advancing hydrogen production for",
      },
      {
        id: "hydrogen-2",
        title: "Fuel Cells",
        description: "Hydrogen-powered energy systems",
        prompt: "How are fuel cell technologies improving for applications in",
      },
      {
        id: "hydrogen-3",
        title: "Infrastructure",
        description: "Systems for hydrogen distribution",
        prompt: "What infrastructure developments support hydrogen adoption for",
      },
      {
        id: "hydrogen-4",
        title: "Transportation",
        description: "Hydrogen-powered vehicles",
        prompt: "How is hydrogen fuel being implemented in transportation systems for",
      },
      {
        id: "hydrogen-5",
        title: "Green Hydrogen",
        description: "Eco-friendly hydrogen production",
        prompt: "What advances in green hydrogen production address challenges in",
      },
      {
        id: "hydrogen-6",
        title: "Industrial Applications",
        description: "Hydrogen use in manufacturing",
        prompt: "How is hydrogen technology transforming industrial processes like",
      }
    ]
  },
  {
    id: "iot",
    title: "IOT",
    description: "Internet of Things connected devices",
    icon: Laptop,
    color: "bg-indigo-400",
    prompts: [
      {
        id: "iot-1",
        title: "Connected Devices",
        description: "Smart objects with internet connectivity",
        prompt: "How are connected devices transforming",
      },
      {
        id: "iot-2",
        title: "IoT Platforms",
        description: "Systems for managing smart devices",
        prompt: "What platforms effectively manage IoT deployments for",
      },
      {
        id: "iot-3",
        title: "IoT Security",
        description: "Protecting connected device networks",
        prompt: "What security approaches protect IoT systems from",
      },
      {
        id: "iot-4",
        title: "Industrial IoT",
        description: "Connected devices in manufacturing",
        prompt: "How is industrial IoT improving operations in",
      },
      {
        id: "iot-5",
        title: "Smart Homes",
        description: "Automated residential technology",
        prompt: "What smart home technologies are enhancing",
      },
      {
        id: "iot-6",
        title: "IoT Analytics",
        description: "Processing data from connected devices",
        prompt: "How can organizations extract value from IoT data regarding",
      }
    ]
  },
  {
    id: "medicaldevices",
    title: "Medical Devices",
    description: "Healthcare equipment and technology",
    icon: Stethoscope,
    color: "bg-blue-400",
    prompts: [
      {
        id: "medicaldevices-1",
        title: "Diagnostic Equipment",
        description: "Devices for medical testing",
        prompt: "What innovations are improving diagnostic devices for",
      },
      {
        id: "medicaldevices-2",
        title: "Wearable Health",
        description: "Body-worn medical monitors",
        prompt: "How are wearable medical devices transforming care for",
      },
      {
        id: "medicaldevices-3",
        title: "Surgical Tools",
        description: "Equipment for medical procedures",
        prompt: "What advances in surgical tools are improving outcomes for",
      },
      {
        id: "medicaldevices-4",
        title: "Remote Monitoring",
        description: "Tracking patient health from afar",
        prompt: "How does remote monitoring technology benefit patients with",
      },
      {
        id: "medicaldevices-5",
        title: "Medical Imaging",
        description: "Visualization technologies for healthcare",
        prompt: "What imaging technologies are advancing diagnosis of",
      },
      {
        id: "medicaldevices-6",
        title: "Regulatory Approval",
        description: "Compliance for medical equipment",
        prompt: "What regulatory pathways exist for medical devices addressing",
      }
    ]
  },
  {
    id: "music",
    title: "Music",
    description: "Music industry and audio technology",
    icon: Headphones,
    color: "bg-purple-400",
    prompts: [
      {
        id: "music-1",
        title: "Music Production",
        description: "Creating and recording music",
        prompt: "What technologies are transforming music production for",
      },
      {
        id: "music-2",
        title: "Streaming Platforms",
        description: "Online music distribution",
        prompt: "How are streaming platforms evolving to better serve",
      },
      {
        id: "music-3",
        title: "Music Business",
        description: "Industry trends and economics",
        prompt: "What business models are emerging in the music industry for",
      },
      {
        id: "music-4",
        title: "Music Technology",
        description: "Audio equipment and software",
        prompt: "How is technology changing how people create music for",
      },
      {
        id: "music-5",
        title: "Live Performance",
        description: "Concert and tour innovations",
        prompt: "What innovations are enhancing live music experiences for",
      },
      {
        id: "music-6",
        title: "Music Discovery",
        description: "Finding new artists and songs",
        prompt: "How are listeners discovering new music through",
      }
    ]
  },
  {
    id: "nanotechnology",
    title: "Nano Technology",
    description: "Microscopic-scale materials and engineering",
    icon: Microscope,
    color: "bg-teal-600",
    prompts: [
      {
        id: "nanotechnology-1",
        title: "Nanomaterials",
        description: "Materials engineered at nano scale",
        prompt: "What applications are being developed for nanomaterials in",
      },
      {
        id: "nanotechnology-2",
        title: "Medical Nanotechnology",
        description: "Nano-scale healthcare solutions",
        prompt: "How is nanotechnology advancing medical treatments for",
      },
      {
        id: "nanotechnology-3",
        title: "Nano Electronics",
        description: "Microscopic electronic components",
        prompt: "What innovations in nano electronics are enabling",
      },
      {
        id: "nanotechnology-4",
        title: "Nano Manufacturing",
        description: "Production at molecular scale",
        prompt: "How are nano manufacturing techniques improving",
      },
      {
        id: "nanotechnology-5",
        title: "Environmental Nano",
        description: "Nanotechnology for sustainability",
        prompt: "What environmental applications of nanotechnology address",
      },
      {
        id: "nanotechnology-6",
        title: "Nano Research",
        description: "Scientific advances in the field",
        prompt: "What research breakthroughs in nanotechnology could impact",
      }
    ]
  },
  {
    id: "nfts",
    title: "NFTs",
    description: "Non-fungible tokens and digital ownership",
    icon: CircuitBoard,
    color: "bg-violet-500",
    prompts: [
      {
        id: "nfts-1",
        title: "Digital Art",
        description: "Art ownership through NFTs",
        prompt: "How is the digital art market evolving through NFTs for",
      },
      {
        id: "nfts-2",
        title: "NFT Platforms",
        description: "Marketplaces for token trading",
        prompt: "Which NFT platforms are best suited for",
      },
      {
        id: "nfts-3",
        title: "NFT Utility",
        description: "Practical uses beyond collectibles",
        prompt: "What utility applications are NFTs enabling for",
      },
      {
        id: "nfts-4",
        title: "NFT Creation",
        description: "Minting and designing tokens",
        prompt: "What approaches to NFT creation are successful for",
      },
      {
        id: "nfts-5",
        title: "NFT Communities",
        description: "Social aspects of token ownership",
        prompt: "How are communities forming around NFT projects like",
      },
      {
        id: "nfts-6",
        title: "NFT Technology",
        description: "Technical aspects of tokens",
        prompt: "What technological innovations are advancing NFTs for",
      }
    ]
  },
  {
    id: "patents",
    title: "Patents",
    description: "Intellectual property and patent law",
    icon: ScrollText,
    color: "bg-amber-600",
    prompts: [
      {
        id: "patents-1",
        title: "Patent Filing",
        description: "Applying for patent protection",
        prompt: "What strategies improve patent applications for",
      },
      {
        id: "patents-2",
        title: "Patent Law",
        description: "Legal frameworks for inventions",
        prompt: "How are patent laws evolving in response to",
      },
      {
        id: "patents-3",
        title: "Patent Strategy",
        description: "Using patents for business advantage",
        prompt: "What patent strategies are effective for companies in",
      },
      {
        id: "patents-4",
        title: "Patent Licensing",
        description: "Monetizing patented inventions",
        prompt: "What licensing approaches maximize value from patents in",
      },
      {
        id: "patents-5",
        title: "Patent Searches",
        description: "Researching existing patents",
        prompt: "How can organizations conduct effective patent searches for",
      },
      {
        id: "patents-6",
        title: "International Patents",
        description: "Global intellectual property protection",
        prompt: "What considerations are important for international patent protection of",
      }
    ]
  },
  {
    id: "payments",
    title: "Payments",
    description: "Transaction processing and payment systems",
    icon: BadgeDollarSign,
    color: "bg-green-500",
    prompts: [
      {
        id: "payments-1",
        title: "Digital Payments",
        description: "Online and mobile transaction methods",
        prompt: "How are digital payment technologies transforming",
      },
      {
        id: "payments-2",
        title: "Payment Security",
        description: "Protecting financial transactions",
        prompt: "What security measures protect payment systems from",
      },
      {
        id: "payments-3",
        title: "Payment Gateways",
        description: "Transaction processing services",
        prompt: "How do payment gateways optimize transactions for",
      },
      {
        id: "payments-4",
        title: "Cross-border Payments",
        description: "International money transfers",
        prompt: "What solutions improve cross-border payments for",
      },
      {
        id: "payments-5",
        title: "Alternative Payments",
        description: "New ways to transfer value",
        prompt: "Which alternative payment methods are gaining traction for",
      },
      {
        id: "payments-6",
        title: "Payment Integration",
        description: "Embedding payment functionality",
        prompt: "How can payment systems be effectively integrated with",
      }
    ]
  },
  {
    id: "privateequity",
    title: "Private Equity",
    description: "Private investment in companies",
    icon: Banknote,
    color: "bg-blue-700",
    prompts: [
      {
        id: "privateequity-1",
        title: "Fund Management",
        description: "Operating private equity firms",
        prompt: "What strategies improve private equity fund performance in",
      },
      {
        id: "privateequity-2",
        title: "Deal Sourcing",
        description: "Finding investment opportunities",
        prompt: "How are private equity firms identifying opportunities in",
      },
      {
        id: "privateequity-3",
        title: "Due Diligence",
        description: "Evaluating potential investments",
        prompt: "What due diligence approaches are effective for private equity examining",
      },
      {
        id: "privateequity-4",
        title: "Value Creation",
        description: "Improving portfolio companies",
        prompt: "How do private equity firms create value in portfolio companies focusing on",
      },
      {
        id: "privateequity-5",
        title: "Exit Strategies",
        description: "Realizing returns from investments",
        prompt: "What exit strategies maximize returns for private equity investments in",
      },
      {
        id: "privateequity-6",
        title: "PE Fundraising",
        description: "Attracting investment capital",
        prompt: "What approaches are effective for private equity fundraising targeting",
      }
    ]
  },
  {
    id: "psychedelics",
    title: "Psychedelics",
    description: "Psychedelic medicine and research",
    icon: Pill,
    color: "bg-purple-500",
    prompts: [
      {
        id: "psychedelics-1",
        title: "Medical Research",
        description: "Clinical studies of psychedelics",
        prompt: "What does research show about therapeutic applications of psychedelics for",
      },
      {
        id: "psychedelics-2",
        title: "Treatment Protocols",
        description: "Medical use frameworks",
        prompt: "What treatment protocols are being developed for psychedelic therapy addressing",
      },
      {
        id: "psychedelics-3",
        title: "Regulatory Path",
        description: "Approval process for treatments",
        prompt: "How is the regulatory landscape evolving for psychedelic treatments of",
      },
      {
        id: "psychedelics-4",
        title: "Industry Development",
        description: "Business aspects of psychedelic medicine",
        prompt: "How is the psychedelics industry developing approaches to",
      },
      {
        id: "psychedelics-5",
        title: "Therapeutic Applications",
        description: "Treating specific conditions",
        prompt: "What conditions show promise for treatment with psychedelic-assisted therapy such as",
      },
      {
        id: "psychedelics-6",
        title: "Research Methods",
        description: "Studying psychedelic compounds",
        prompt: "What research methodologies are advancing understanding of psychedelics for",
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
    id: "realestate",
    title: "Real Estate",
    description: "Property technology and innovation",
    icon: Building,
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
    id: "semiconductor",
    title: "Semiconductor",
    description: "Computer chip design and manufacturing",
    icon: CircuitBoard,
    color: "bg-orange-600",
    prompts: [
      {
        id: "semiconductor-1",
        title: "Chip Design",
        description: "Creating semiconductor circuits",
        prompt: "What innovations are advancing semiconductor design for",
      },
      {
        id: "semiconductor-2",
        title: "Manufacturing",
        description: "Producing semiconductor components",
        prompt: "How are manufacturing processes evolving for semiconductors used in",
      },
      {
        id: "semiconductor-3",
        title: "Materials Science",
        description: "Substances used in semiconductors",
        prompt: "What materials advances are improving semiconductors for",
      },
      {
        id: "semiconductor-4",
        title: "Industry Trends",
        description: "Market developments for chips",
        prompt: "How are industry trends reshaping semiconductor production for",
      },
      {
        id: "semiconductor-5",
        title: "Specialized Chips",
        description: "Purpose-built semiconductor designs",
        prompt: "What specialized semiconductor designs are optimizing",
      },
      {
        id: "semiconductor-6",
        title: "Supply Chain",
        description: "Component sourcing and logistics",
        prompt: "How are semiconductor companies addressing supply chain challenges for",
      }
    ]
  },
  {
    id: "seo",
    title: "SEO",
    description: "Search engine optimization techniques",
    icon: Search,
    color: "bg-blue-400",
    prompts: [
      {
        id: "seo-1",
        title: "On-page SEO",
        description: "Optimizing website content",
        prompt: "What on-page SEO techniques improve rankings for",
      },
      {
        id: "seo-2",
        title: "Link Building",
        description: "Acquiring inbound links",
        prompt: "What link building strategies are effective for websites about",
      },
      {
        id: "seo-3",
        title: "Technical SEO",
        description: "Website structure optimization",
        prompt: "How can technical SEO improve performance of sites focusing on",
      },
      {
        id: "seo-4",
        title: "Local SEO",
        description: "Ranking in local search results",
        prompt: "What local SEO approaches work best for businesses offering",
      },
      {
        id: "seo-5",
        title: "SEO Analytics",
        description: "Measuring search performance",
        prompt: "How can organizations effectively measure SEO success for",
      },
      {
        id: "seo-6",
        title: "Content Strategy",
        description: "Creating search-friendly content",
        prompt: "What content strategies drive search visibility for",
      }
    ]
  },
  {
    id: "solar",
    title: "Solar",
    description: "Solar energy and photovoltaic technology",
    icon: BatteryFull,
    color: "bg-yellow-500",
    prompts: [
      {
        id: "solar-1",
        title: "Photovoltaics",
        description: "Solar panel technology",
        prompt: "What advances are improving photovoltaic efficiency for",
      },
      {
        id: "solar-2",
        title: "Solar Installation",
        description: "Setting up solar energy systems",
        prompt: "What techniques optimize solar installations for",
      },
      {
        id: "solar-3",
        title: "Solar Storage",
        description: "Batteries for solar energy",
        prompt: "How are storage solutions enhancing solar energy systems for",
      },
      {
        id: "solar-4",
        title: "Solar Policy",
        description: "Government approaches to solar",
        prompt: "What policy frameworks best support solar adoption for",
      },
      {
        id: "solar-5",
        title: "Solar Finance",
        description: "Funding solar energy projects",
        prompt: "What financing models make solar accessible for",
      },
      {
        id: "solar-6",
        title: "Solar Innovation",
        description: "New approaches to solar energy",
        prompt: "What innovations are expanding solar applications for",
      }
    ]
  },
  {
    id: "spacs",
    title: "SPACs",
    description: "Special Purpose Acquisition Companies",
    icon: MoveVertical,
    color: "bg-blue-600",
    prompts: [
      {
        id: "spacs-1",
        title: "SPAC Formation",
        description: "Creating acquisition companies",
        prompt: "What considerations are important when forming SPACs targeting",
      },
      {
        id: "spacs-2",
        title: "Target Selection",
        description: "Identifying companies to acquire",
        prompt: "How do SPACs evaluate potential acquisition targets in",
      },
      {
        id: "spacs-3",
        title: "SPAC Mergers",
        description: "Completing business combinations",
        prompt: "What factors contribute to successful SPAC mergers with",
      },
      {
        id: "spacs-4",
        title: "SPAC Regulation",
        description: "Legal framework for SPACs",
        prompt: "How is the regulatory environment evolving for SPACs focusing on",
      },
      {
        id: "spacs-5",
        title: "Investor Relations",
        description: "Engaging SPAC shareholders",
        prompt: "What investor relations strategies work for SPACs targeting",
      },
      {
        id: "spacs-6",
        title: "Market Trends",
        description: "SPAC activity and developments",
        prompt: "What trends are shaping the SPAC market for companies in",
      }
    ]
  },
  {
    id: "startups",
    title: "Startups",
    description: "Early-stage companies and entrepreneurship",
    icon: Rocket,
    color: "bg-red-500",
    prompts: [
      {
        id: "startups-1",
        title: "Fundraising",
        description: "Securing startup capital",
        prompt: "What fundraising strategies work for startups in",
      },
      {
        id: "startups-2",
        title: "Product Development",
        description: "Creating startup offerings",
        prompt: "How can startups optimize product development for",
      },
      {
        id: "startups-3",
        title: "Market Entry",
        description: "Launching in new markets",
        prompt: "What market entry strategies are effective for startups offering",
      },
      {
        id: "startups-4",
        title: "Team Building",
        description: "Assembling startup personnel",
        prompt: "How can startups build effective teams for",
      },
      {
        id: "startups-5",
        title: "Growth Strategies",
        description: "Scaling startup operations",
        prompt: "What growth strategies work for startups focusing on",
      },
      {
        id: "startups-6",
        title: "Startup Ecosystems",
        description: "Entrepreneurial communities",
        prompt: "How are startup ecosystems evolving to support",
      }
    ]
  },
  {
    id: "stemcell",
    title: "Stem Cell",
    description: "Stem cell research and therapies",
    icon: FlaskConical,
    color: "bg-purple-500",
    prompts: [
      {
        id: "stemcell-1",
        title: "Medical Applications",
        description: "Therapeutic uses of stem cells",
        prompt: "How are stem cells being used to treat conditions like",
      },
      {
        id: "stemcell-2",
        title: "Research Advances",
        description: "Scientific progress with stem cells",
        prompt: "What recent research advances involve stem cells for",
      },
      {
        id: "stemcell-3",
        title: "Cell Culturing",
        description: "Growing stem cells in labs",
        prompt: "What techniques improve stem cell culturing for",
      },
      {
        id: "stemcell-4",
        title: "Regulatory Framework",
        description: "Rules governing stem cell use",
        prompt: "How are regulations evolving for stem cell therapies addressing",
      },
      {
        id: "stemcell-5",
        title: "Industry Growth",
        description: "Commercial stem cell developments",
        prompt: "How is the stem cell industry developing solutions for",
      },
      {
        id: "stemcell-6",
        title: "Ethical Considerations",
        description: "Moral aspects of stem cell use",
        prompt: "What ethical frameworks guide stem cell research for",
      }
    ]
  },
  {
    id: "supplychain",
    title: "Supply Chain",
    description: "Logistics and distribution networks",
    icon: Truck,
    color: "bg-blue-500",
    prompts: [
      {
        id: "supplychain-1",
        title: "Logistics Optimization",
        description: "Improving movement of goods",
        prompt: "What strategies optimize supply chain logistics for",
      },
      {
        id: "supplychain-2",
        title: "Supply Visibility",
        description: "Tracking goods and materials",
        prompt: "How can organizations improve supply chain visibility for",
      },
      {
        id: "supplychain-3",
        title: "Inventory Management",
        description: "Controlling stock levels",
        prompt: "What inventory management approaches work best for",
      },
      {
        id: "supplychain-4",
        title: "Sustainable Supply",
        description: "Eco-friendly distribution",
        prompt: "How can supply chains become more sustainable for",
      },
      {
        id: "supplychain-5",
        title: "Supply Chain Tech",
        description: "Technology for logistics",
        prompt: "What technologies are transforming supply chains for",
      },
      {
        id: "supplychain-6",
        title: "Resilient Chains",
        description: "Adapting to disruptions",
        prompt: "How can organizations build supply chain resilience against",
      }
    ]
  },
  {
    id: "trading",
    title: "Trading",
    description: "Market trading and investment strategies",
    icon: LineChart,
    color: "bg-blue-500",
    prompts: [
      {
        id: "trading-1",
        title: "Trading Strategies",
        description: "Approaches to market transactions",
        prompt: "What trading strategies are effective for markets like",
      },
      {
        id: "trading-2",
        title: "Technical Analysis",
        description: "Chart-based market evaluation",
        prompt: "How can technical analysis be applied to trading",
      },
      {
        id: "trading-3",
        title: "Algorithmic Trading",
        description: "Automated trading systems",
        prompt: "What algorithmic approaches improve trading outcomes for",
      },
      {
        id: "trading-4",
        title: "Risk Management",
        description: "Protecting trading capital",
        prompt: "What risk management techniques protect traders from",
      },
      {
        id: "trading-5",
        title: "Market Analysis",
        description: "Evaluating market conditions",
        prompt: "How can traders effectively analyze markets for",
      },
      {
        id: "trading-6",
        title: "Trading Psychology",
        description: "Mental aspects of trading",
        prompt: "What psychological approaches improve trading decisions during",
      }
    ]
  },
  {
    id: "venturecapital",
    title: "Venture Capital",
    description: "Startup investment and funding",
    icon: Rocket,
    color: "bg-indigo-600",
    prompts: [
      {
        id: "venturecapital-1",
        title: "Fund Management",
        description: "Operating venture capital firms",
        prompt: "What strategies improve venture capital fund performance in",
      },
      {
        id: "venturecapital-2",
        title: "Deal Flow",
        description: "Finding startup investments",
        prompt: "How are VCs sourcing deals in the sector of",
      },
      {
        id: "venturecapital-3",
        title: "Due Diligence",
        description: "Evaluating startup investments",
        prompt: "What due diligence approaches are effective for VCs examining",
      },
      {
        id: "venturecapital-4",
        title: "Startup Support",
        description: "Helping portfolio companies",
        prompt: "How do VCs add value to portfolio companies focusing on",
      },
      {
        id: "venturecapital-5",
        title: "Exit Strategies",
        description: "Realizing returns from startups",
        prompt: "What exit strategies maximize returns for VC investments in",
      },
      {
        id: "venturecapital-6",
        title: "VC Fundraising",
        description: "Attracting limited partners",
        prompt: "What approaches are effective for raising venture capital funds targeting",
      }
    ]
  },
  {
    id: "wastemanagement",
    title: "Waste Management",
    description: "Waste disposal and recycling systems",
    icon: Warehouse,
    color: "bg-green-600",
    prompts: [
      {
        id: "wastemanagement-1",
        title: "Recycling Systems",
        description: "Materials recovery and reuse",
        prompt: "What recycling approaches effectively process",
      },
      {
        id: "wastemanagement-2",
        title: "Waste Reduction",
        description: "Minimizing generated waste",
        prompt: "How can organizations reduce waste generated from",
      },
      {
        id: "wastemanagement-3",
        title: "Waste Treatment",
        description: "Processing hazardous materials",
        prompt: "What treatment technologies address waste from",
      },
      {
        id: "wastemanagement-4",
        title: "Circular Economy",
        description: "Eliminating waste through design",
        prompt: "How does the circular economy approach transform waste from",
      },
      {
        id: "wastemanagement-5",
        title: "Waste Technology",
        description: "Innovation in waste processing",
        prompt: "What technologies are improving waste management for",
      },
      {
        id: "wastemanagement-6",
        title: "Waste Policy",
        description: "Regulatory approaches to waste",
        prompt: "What policy frameworks effectively address waste from",
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
