
import { 
  DollarSign, 
  Heart, 
  Laptop, 
  GraduationCap, 
  Megaphone, 
  Scale, 
  Home, 
  Factory, 
  ShoppingBag, 
  Users, 
  Film, 
  Wheat 
} from "lucide-react";

export interface SearchPrompt {
  id: string;
  title: string;
  prompt: string;
}

export interface SearchCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  prompts: SearchPrompt[];
}

export const searchCategories: SearchCategory[] = [
  {
    id: "finance",
    title: "Finance",
    description: "Financial planning, investment strategies, and market analysis",
    icon: DollarSign,
    color: "bg-green-500",
    prompts: [
      {
        id: "marketAnalysis",
        title: "Analyze current market trends",
        prompt: "Analyze current market trends and provide insights on investment opportunities"
      },
      {
        id: "investmentStrategy",
        title: "Create an investment strategy for beginners",
        prompt: "Create a comprehensive investment strategy guide for beginners with risk management"
      },
      {
        id: "budgetPlanning",
        title: "Help me create a monthly budget",
        prompt: "Help me create a detailed monthly budget plan based on my income and expenses"
      },
      {
        id: "cryptoGuide",
        title: "Explain cryptocurrency basics",
        prompt: "Explain cryptocurrency basics and how to get started with digital investments"
      },
      {
        id: "retirementPlanning",
        title: "Plan for retirement savings",
        prompt: "Create a retirement savings plan with timeline and investment recommendations"
      }
    ]
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Health advice, wellness tips, and medical information",
    icon: Heart,
    color: "bg-red-500",
    prompts: [
      {
        id: "symptomChecker",
        title: "General health symptom information",
        prompt: "Provide general information about common health symptoms and when to see a doctor"
      },
      {
        id: "exerciseRoutine",
        title: "Create a beginner workout plan",
        prompt: "Create a beginner-friendly workout plan for overall fitness and health"
      },
      {
        id: "nutritionAdvice",
        title: "Healthy eating guidelines",
        prompt: "Provide healthy eating guidelines and nutrition tips for optimal wellness"
      },
      {
        id: "mentalHealth",
        title: "Stress management techniques",
        prompt: "Share effective stress management techniques and mental health strategies"
      },
      {
        id: "preventiveCare",
        title: "Preventive healthcare checklist",
        prompt: "Create a preventive healthcare checklist for maintaining good health"
      }
    ]
  },
  {
    id: "technology",
    title: "Technology",
    description: "Tech trends, programming help, and digital solutions",
    icon: Laptop,
    color: "bg-blue-500",
    prompts: [
      {
        id: "codingHelp",
        title: "Debug my JavaScript code",
        prompt: "Help me debug and optimize my JavaScript code for better performance"
      },
      {
        id: "techTrends",
        title: "Latest technology trends 2024",
        prompt: "Explain the latest technology trends in 2024 and their impact on business"
      },
      {
        id: "cybersecurity",
        title: "Improve my online security",
        prompt: "Provide tips to improve my online security and protect against cyber threats"
      },
      {
        id: "aiExplainer",
        title: "Explain artificial intelligence",
        prompt: "Explain artificial intelligence concepts and applications in simple terms"
      },
      {
        id: "gadgetReview",
        title: "Best smartphones under $500",
        prompt: "Review and recommend the best smartphones under $500 with detailed comparisons"
      }
    ]
  },
  {
    id: "education",
    title: "Education",
    description: "Learning resources, study tips, and career guidance",
    icon: GraduationCap,
    color: "bg-purple-500",
    prompts: [
      {
        id: "studyTips",
        title: "Effective study techniques",
        prompt: "Share effective study techniques and learning strategies for better retention"
      },
      {
        id: "careerGuidance",
        title: "Choose the right career path",
        prompt: "Help me choose the right career path based on my interests and skills"
      },
      {
        id: "onlineLearning",
        title: "Best online learning platforms",
        prompt: "Recommend the best online learning platforms for professional development"
      },
      {
        id: "skillDevelopment",
        title: "Learn new skills quickly",
        prompt: "Guide me on how to learn new skills quickly and efficiently"
      },
      {
        id: "examPrep",
        title: "Prepare for standardized tests",
        prompt: "Create a study plan for preparing for standardized tests and exams"
      }
    ]
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Digital marketing strategies and brand development",
    icon: Megaphone,
    color: "bg-orange-500",
    prompts: [
      {
        id: "brandStrategy",
        title: "Develop a brand strategy",
        prompt: "Help me develop a comprehensive brand strategy for my business"
      },
      {
        id: "socialMedia",
        title: "Create a social media plan",
        prompt: "Create an effective social media marketing plan for increasing engagement"
      },
      {
        id: "contentMarketing",
        title: "Content marketing best practices",
        prompt: "Share content marketing best practices for building audience and driving sales"
      },
      {
        id: "seoOptimization",
        title: "Improve website SEO",
        prompt: "Provide actionable tips to improve my website's SEO and search rankings"
      },
      {
        id: "customerEngagement",
        title: "Increase customer engagement",
        prompt: "Suggest strategies to increase customer engagement and loyalty"
      }
    ]
  },
  {
    id: "legal",
    title: "Legal",
    description: "Legal guidance and compliance information",
    icon: Scale,
    color: "bg-indigo-500",
    prompts: [
      {
        id: "contractReview",
        title: "Understanding contract terms",
        prompt: "Help me understand common contract terms and what to look for"
      },
      {
        id: "businessLaw",
        title: "Small business legal requirements",
        prompt: "Explain the essential legal requirements for starting a small business"
      },
      {
        id: "intellectualProperty",
        title: "Protect intellectual property",
        prompt: "Guide me on how to protect my intellectual property and trademarks"
      },
      {
        id: "employmentLaw",
        title: "Workplace rights and obligations",
        prompt: "Explain workplace rights and obligations for employees and employers"
      },
      {
        id: "estatePlanning",
        title: "Basic estate planning guide",
        prompt: "Provide a basic guide to estate planning and important considerations"
      }
    ]
  },
  {
    id: "realEstate",
    title: "Real Estate",
    description: "Property investment and real estate guidance",
    icon: Home,
    color: "bg-yellow-500",
    prompts: [
      {
        id: "propertyValuation",
        title: "Estimate property value",
        prompt: "Help me understand how to estimate property values and market trends"
      },
      {
        id: "buyingGuide",
        title: "First-time home buying tips",
        prompt: "Provide a comprehensive guide for first-time home buyers"
      },
      {
        id: "investmentProperties",
        title: "Real estate investment strategies",
        prompt: "Explain real estate investment strategies and how to get started"
      },
      {
        id: "marketAnalysis",
        title: "Local real estate market trends",
        prompt: "Analyze local real estate market trends and future predictions"
      },
      {
        id: "renovation",
        title: "Home renovation planning",
        prompt: "Help me plan a home renovation project with budget and timeline considerations"
      }
    ]
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Production processes and industrial solutions",
    icon: Factory,
    color: "bg-gray-500",
    prompts: [
      {
        id: "processOptimization",
        title: "Optimize manufacturing processes",
        prompt: "Help me optimize manufacturing processes for efficiency and cost reduction"
      },
      {
        id: "qualityControl",
        title: "Implement quality control systems",
        prompt: "Guide me on implementing effective quality control systems in manufacturing"
      },
      {
        id: "supplyChain",
        title: "Supply chain management strategies",
        prompt: "Explain supply chain management strategies for better efficiency"
      },
      {
        id: "automation",
        title: "Manufacturing automation benefits",
        prompt: "Discuss the benefits and implementation of automation in manufacturing"
      },
      {
        id: "sustainability",
        title: "Sustainable manufacturing practices",
        prompt: "Share sustainable manufacturing practices for environmental responsibility"
      }
    ]
  },
  {
    id: "retail",
    title: "Retail",
    description: "Retail operations and customer service",
    icon: ShoppingBag,
    color: "bg-pink-500",
    prompts: [
      {
        id: "inventoryManagement",
        title: "Optimize inventory levels",
        prompt: "Help me optimize inventory management for better cash flow and efficiency"
      },
      {
        id: "customerService",
        title: "Improve customer service",
        prompt: "Provide strategies to improve customer service and satisfaction in retail"
      },
      {
        id: "ecommerce",
        title: "Start an online store",
        prompt: "Guide me through starting an online store and e-commerce best practices"
      },
      {
        id: "merchandising",
        title: "Product merchandising strategies",
        prompt: "Share effective product merchandising strategies to increase sales"
      },
      {
        id: "salesTechniques",
        title: "Effective sales techniques",
        prompt: "Teach me effective sales techniques for retail environments"
      }
    ]
  },
  {
    id: "consulting",
    title: "Consulting",
    description: "Business consulting and advisory services",
    icon: Users,
    color: "bg-teal-500",
    prompts: [
      {
        id: "businessStrategy",
        title: "Develop business strategy",
        prompt: "Help me develop a comprehensive business strategy for growth and success"
      },
      {
        id: "changeManagement",
        title: "Manage organizational change",
        prompt: "Guide me through managing organizational change effectively"
      },
      {
        id: "performanceImprovement",
        title: "Improve team performance",
        prompt: "Provide strategies to improve team performance and productivity"
      },
      {
        id: "riskAssessment",
        title: "Conduct risk assessments",
        prompt: "Help me conduct thorough risk assessments for business decisions"
      },
      {
        id: "projectManagement",
        title: "Effective project management",
        prompt: "Share effective project management methodologies and best practices"
      }
    ]
  },
  {
    id: "entertainment",
    title: "Entertainment",
    description: "Creative content and entertainment industry",
    icon: Film,
    color: "bg-violet-500",
    prompts: [
      {
        id: "contentCreation",
        title: "Create engaging content",
        prompt: "Help me create engaging content for entertainment and media platforms"
      },
      {
        id: "movieRecommendations",
        title: "Recommend movies to watch",
        prompt: "Recommend movies and shows based on my preferences and mood"
      },
      {
        id: "musicProduction",
        title: "Music production basics",
        prompt: "Explain music production basics and getting started with audio creation"
      },
      {
        id: "gameDesign",
        title: "Video game design principles",
        prompt: "Share video game design principles and development considerations"
      },
      {
        id: "eventPlanning",
        title: "Plan entertainment events",
        prompt: "Help me plan entertainment events and memorable experiences"
      }
    ]
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Farming practices and agricultural technology",
    icon: Wheat,
    color: "bg-emerald-500",
    prompts: [
      {
        id: "cropManagement",
        title: "Optimize crop yields",
        prompt: "Help me optimize crop yields through better farming practices and technology"
      },
      {
        id: "sustainableFarming",
        title: "Sustainable farming practices",
        prompt: "Share sustainable farming practices for environmental and economic benefits"
      },
      {
        id: "livestockCare",
        title: "Livestock health management",
        prompt: "Guide me on livestock health management and animal welfare practices"
      },
      {
        id: "marketPrices",
        title: "Agricultural market analysis",
        prompt: "Analyze agricultural market trends and pricing strategies"
      },
      {
        id: "organicFarming",
        title: "Transition to organic farming",
        prompt: "Help me transition to organic farming methods and certification process"
      }
    ]
  }
];

export const getCategoryById = (id: string): SearchCategory | undefined => {
  return searchCategories.find(category => category.id === id);
};
