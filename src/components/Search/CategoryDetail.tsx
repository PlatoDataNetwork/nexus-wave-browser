
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Grid3X3 } from "lucide-react";
import { categories } from './CategoryCubes';
import * as Icons from 'lucide-react';
import { useConversationContext } from '@/contexts/ConversationContext';
import ConversationDisplay from './ConversationDisplay';
import ChatInput from './ChatInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Enhanced category-specific prompts - 50 per category
const categoryPrompts: Record<string, string[]> = {
  // Default prompts will only be used as fallback
  default: [
    "What are the latest developments in this field?",
    "Explain the fundamentals of this category to a beginner",
    "What are the top companies in this sector?",
    "What are the biggest challenges facing this industry?",
    "What are the most promising opportunities in this area?",
    "How has this field evolved over the past decade?",
    "What skills are needed to work in this industry?",
    "Who are the leading experts in this field?",
    "What are the most influential books about this topic?",
    "How is AI transforming this industry?",
    "What educational background is needed for careers in this field?",
    "What are common misconceptions about this industry?",
    "How does this industry vary across different countries?",
    "What regulatory changes are affecting this sector?",
    "What are the environmental impacts of this industry?",
    "How accessible is this industry to newcomers?",
    "What are the ethical considerations in this field?",
    "How does this sector interact with other industries?",
    "What technological advancements are disrupting this field?",
    "What are the historical milestones in this industry?",
    "How profitable is this industry currently?",
    "What startups are making waves in this field?",
    "How is this industry addressing diversity and inclusion?",
    "What are typical career paths in this field?",
    "How is consumer behavior changing in this market?",
    "What are the best resources to learn more about this topic?",
    "How is data analytics used in this industry?",
    "What are the current research priorities in this field?",
    "How has the pandemic affected this industry?",
    "What are the most innovative products in this sector?",
    "How is this industry approaching sustainability?",
    "What are the biggest risks for businesses in this sector?",
    "How is globalization impacting this industry?",
    "What are the most promising investment opportunities here?",
    "How is remote work changing this industry?",
    "What certifications are valuable for professionals in this field?",
    "How are traditional players adapting to digital transformation?",
    "What are the best conferences or events for this industry?",
    "How are consumer preferences evolving in this market?",
    "What are the unique challenges for startups in this space?",
    "How does government policy affect this industry?",
    "What are the most important metrics for success in this field?",
    "How is social media influencing this industry?",
    "What philanthropic initiatives exist in this sector?",
    "How accessible is funding for new ventures in this space?",
    "What are the most common customer complaints in this industry?",
    "How is this industry addressing security concerns?",
    "What are the current supply chain challenges in this sector?",
    "How is this industry preparing for future crises?",
    "What emerging markets are important for this industry?"
  ],
  ai: [
    "Explain the differences between machine learning, deep learning, and artificial intelligence",
    "What are the ethical implications of AI development?",
    "How is AI being used in healthcare today?",
    "What are the latest breakthroughs in natural language processing?",
    "How can businesses implement AI solutions effectively?",
    "What skills are needed to work in the AI industry?",
    "How is AI transforming education?",
    "What are the limitations of current AI technology?",
    "Explain how neural networks function",
    "How is computer vision being applied in various industries?",
    "What are the implications of AI for employment?",
    "How is AI being regulated across different countries?",
    "What are GANs and how are they used in AI?",
    "Explain the concept of AI bias and how it can be addressed",
    "How is reinforcement learning different from supervised learning?",
    "What are the biggest challenges facing AI research today?",
    "How is AI impacting creative fields like art and music?",
    "What is explainable AI and why is it important?",
    "How are large language models like GPT changing the AI landscape?",
    "What are the most promising AI startups to watch?",
    "How is AI being used in environmental conservation?",
    "What are the security implications of advanced AI systems?",
    "How is AI helping with scientific discoveries?",
    "What are the applications of AI in agriculture?",
    "How is federated learning protecting privacy in AI?",
    "What are the current limitations of AI in understanding context?",
    "How is AI being used to predict and prevent diseases?",
    "What role does quantum computing play in advancing AI?",
    "How are robotics and AI working together?",
    "What are the different approaches to achieving artificial general intelligence?",
    "How is AI being used in financial markets?",
    "What are the energy consumption concerns with AI systems?",
    "How is AI impacting legal systems and law enforcement?",
    "What are the most important AI research institutions globally?",
    "How is AI transforming customer service?",
    "What are the challenges of implementing AI in developing countries?",
    "How is AI helping with climate change predictions?",
    "What are the applications of AI in sports analytics?",
    "How is AI changing transportation and autonomous vehicles?",
    "What frameworks exist for responsible AI development?",
    "How is AI being used in space exploration?",
    "What are the current benchmarks for measuring AI capabilities?",
    "How is transfer learning advancing AI development?",
    "What are the applications of AI in manufacturing?",
    "How is AI transforming language translation?",
    "What role does AI play in cybersecurity?",
    "How are small businesses adopting AI technologies?",
    "What are the applications of AI in entertainment and gaming?",
    "How is AI helping with humanitarian efforts?",
    "What are the current challenges in AI alignment with human values?"
  ],
  blockchain: [
    "Explain how blockchain technology works",
    "What are the differences between Bitcoin and Ethereum?",
    "How is blockchain being used outside of cryptocurrency?",
    "What is the environmental impact of blockchain technology?",
    "What are smart contracts and how do they work?",
    "What regulations are affecting blockchain development?",
    "How do decentralized applications (dApps) function?",
    "What is the concept of mining in blockchain?",
    "Explain the different consensus mechanisms in blockchain",
    "How secure is blockchain technology?",
    "What are NFTs and how have they disrupted digital ownership?",
    "How is blockchain transforming supply chain management?",
    "What is DeFi (decentralized finance) and how is it changing traditional banking?",
    "What are layer 2 scaling solutions for blockchain?",
    "How do blockchain oracles work?",
    "What is the difference between public and private blockchains?",
    "How are central banks approaching digital currencies?",
    "What are the governance structures in blockchain networks?",
    "How can blockchain help with identity verification?",
    "What are the most promising blockchain use cases in healthcare?",
    "How is blockchain being used to fight counterfeit products?",
    "What is the role of tokens in blockchain ecosystems?",
    "How are traditional financial institutions adopting blockchain?",
    "What are the challenges of blockchain interoperability?",
    "How is blockchain being used in voting systems?",
    "What is the metaverse and how does blockchain enable it?",
    "How are DAOs (Decentralized Autonomous Organizations) structured?",
    "What are the tax implications of cryptocurrency transactions?",
    "How is blockchain transforming intellectual property management?",
    "What are the most energy-efficient blockchain networks?",
    "How is blockchain being used in charitable organizations?",
    "What are stablecoins and how do they maintain their value?",
    "How is blockchain transforming real estate transactions?",
    "What is yield farming in the crypto space?",
    "How can small businesses benefit from blockchain technology?",
    "What are the different types of cryptocurrency wallets?",
    "How is blockchain being used in education for credential verification?",
    "What is the Lightning Network and how does it improve Bitcoin?",
    "How are insurance companies using blockchain?",
    "What are the legal challenges facing blockchain adoption?",
    "How does tokenization of real-world assets work?",
    "What are the implications of zero-knowledge proofs for privacy?",
    "How is blockchain being used in the gaming industry?",
    "What are the different blockchain development platforms?",
    "How is blockchain helping with royalty distribution in the music industry?",
    "What are atomic swaps in cryptocurrency trading?",
    "How is blockchain being used in government services?",
    "What are the security best practices for blockchain systems?",
    "How are blockchain networks addressing scalability issues?",
    "What is the future of decentralized social media platforms?"
  ],
  finance: [
    "What are the most promising fintech innovations today?",
    "How is blockchain changing traditional finance?",
    "Explain decentralized finance (DeFi) and its potential",
    "What are the biggest risks in cryptocurrency investing?",
    "How do stablecoins work and what are their use cases?",
    "What regulations are impacting the finance sector?",
    "How are traditional banks responding to fintech disruption?",
    "What is open banking and how is it transforming financial services?",
    "Explain the concept of tokenization in financial markets",
    "How are robo-advisors changing investment management?",
    "What are the implications of Central Bank Digital Currencies?",
    "How is AI transforming fraud detection in financial services?",
    "What are the benefits and risks of algorithmic trading?",
    "How is financial inclusion being improved through technology?",
    "What are the emerging trends in mobile payment systems?",
    "How do cryptocurrency exchanges operate?",
    "What are the differences between traditional and digital asset custody?",
    "How is peer-to-peer lending disrupting traditional loan models?",
    "What are the challenges of regulating decentralized financial systems?",
    "How is blockchain being used for cross-border payments?",
    "What are the most innovative insurtech solutions?",
    "How is data analytics transforming risk assessment in finance?",
    "What are security token offerings (STOs) and their advantages?",
    "How are pension funds approaching cryptocurrency investments?",
    "What is quantitative easing and how does it affect markets?",
    "How is financial literacy being improved through technology?",
    "What are the ethical considerations in algorithmic lending decisions?",
    "How are ESG factors being integrated into investment strategies?",
    "What are the differences between various cryptocurrency lending platforms?",
    "How is real estate being tokenized through blockchain?",
    "What are the challenges facing neobanks and digital-only banks?",
    "How do automated market makers work in decentralized exchanges?",
    "What are the taxation implications of cryptocurrency mining?",
    "How is biometric authentication improving financial security?",
    "What are the most significant financial regulation changes in recent years?",
    "How is wealth management changing for high-net-worth individuals?",
    "What are the applications of AI in portfolio management?",
    "How do prediction markets work in the cryptocurrency ecosystem?",
    "What are the challenges of valuing digital assets?",
    "How is compliance being automated in financial institutions?",
    "What are the different models for digital banking?",
    "How are remittances being transformed by digital technologies?",
    "What are the implications of zero-interest rate policies?",
    "How are alternative credit scoring models expanding access to credit?",
    "What are the most innovative wealth management applications?",
    "How is behavioral economics being applied in financial services?",
    "What are the challenges of implementing blockchain in traditional banking?",
    "How are sovereign wealth funds approaching digital asset investments?",
    "What are the current trends in financial market infrastructure?",
    "How is financial data aggregation changing personal financial management?"
  ],
  healthcare: [
    "How is AI transforming healthcare diagnostics?",
    "What are the latest medical technology breakthroughs?",
    "Explain the concept of precision medicine",
    "How are wearable devices changing healthcare monitoring?",
    "What are the ethical considerations in genetic testing?",
    "How is telemedicine evolving post-pandemic?",
    "What are the applications of blockchain in healthcare records?",
    "How is 3D printing being used in medical treatments?",
    "What are the challenges of implementing AI in clinical settings?",
    "How is virtual reality being used in medical training?",
    "What are the latest advancements in cancer treatment?",
    "How is data analytics improving patient outcomes?",
    "What are the regulatory challenges for digital health solutions?",
    "How are robotics transforming surgical procedures?",
    "What is the potential of CRISPR technology in treating diseases?",
    "How is healthcare addressing interoperability of electronic records?",
    "What are the innovations in remote patient monitoring?",
    "How is predictive analytics being used to prevent disease outbreaks?",
    "What are the advancements in neuroscience and brain mapping?",
    "How is healthcare addressing mental health through technology?",
    "What are the latest developments in regenerative medicine?",
    "How is genomic sequencing changing disease treatment?",
    "What are the challenges of healthcare data privacy?",
    "How are digital therapeutics being integrated into treatment plans?",
    "What are the innovations in drug discovery through AI?",
    "How are augmented reality applications assisting medical professionals?",
    "What are the advancements in prosthetics and bionics?",
    "How is personalized nutrition changing preventative healthcare?",
    "What are the latest developments in vaccine technology?",
    "How are healthcare systems addressing health equity through technology?",
    "What are the innovations in chronic disease management?",
    "How is cloud computing improving healthcare delivery?",
    "What are the latest developments in non-invasive diagnostics?",
    "How is AI being used to predict patient deterioration in hospitals?",
    "What are the challenges of scaling telehealth in rural areas?",
    "How are smartphones becoming medical devices?",
    "What are the latest developments in pain management technologies?",
    "How is healthcare addressing the aging population through innovation?",
    "What are the advancements in maternal health monitoring?",
    "How is nanotechnology being applied in medical treatments?",
    "What are the challenges of implementing AI-based clinical decision support?",
    "How are chatbots and virtual assistants changing patient engagement?",
    "What are the latest developments in immunotherapy?",
    "How is healthcare addressing physician burnout through technology?",
    "What are the innovations in pediatric care through technology?",
    "How is IoT transforming hospital management?",
    "What are the latest developments in organ transplantation?",
    "How is healthcare addressing antibiotic resistance through innovation?",
    "What are the advancements in medical imaging technologies?",
    "How is blockchain being used for pharmaceutical supply chain verification?"
  ],
  aerospace: [
    "What are the latest developments in commercial space travel?",
    "How are satellites being used for global communications?",
    "Explain the challenges of Mars exploration",
    "What innovations are making aircraft more fuel-efficient?",
    "How is AI being applied in aviation safety?",
    "What's the future of supersonic air travel?",
    "How are drones transforming various industries?",
    "What are the challenges of space debris management?",
    "How is the commercialization of space changing the aerospace industry?",
    "What materials innovations are improving aircraft performance?",
    "How are reusable rockets changing space economics?",
    "What are the latest advancements in air traffic control systems?",
    "How is quantum computing being applied to aerospace challenges?",
    "What are the environmental impacts of the aerospace industry?",
    "How are small satellites revolutionizing space applications?",
    "What are the challenges of developing electric aircraft?",
    "How is space tourism evolving and what are its implications?",
    "What are the latest developments in hypersonic flight?",
    "How is AI optimizing aircraft maintenance?",
    "What are the challenges of deep space communications?",
    "How are autonomous systems being integrated into aircraft?",
    "What are the latest developments in space-based solar power?",
    "How is 3D printing transforming aerospace manufacturing?",
    "What are the challenges of implementing urban air mobility?",
    "How is space weather monitoring improving?",
    "What are the latest advancements in propulsion technology?",
    "How are satellites helping with climate change monitoring?",
    "What are the challenges of human adaptation to space?",
    "How is augmented reality being used in aircraft maintenance?",
    "What are the international regulations governing space activities?",
    "How are satellites improving agriculture through remote sensing?",
    "What are the developments in space habitats for long-duration missions?",
    "How is AI helping with spacecraft navigation?",
    "What are the latest innovations in aircraft cabin design?",
    "How are zero-gravity environments being utilized for research?",
    "What are the challenges of lunar resource utilization?",
    "How is the aerospace industry addressing cybersecurity?",
    "What are the applications of high-altitude platforms?",
    "How is space-based manufacturing developing?",
    "What are the advancements in aircraft noise reduction?",
    "How are space agencies collaborating with private companies?",
    "What are the challenges of space-based internet services?",
    "How is virtual reality being used in aerospace training?",
    "What are the latest developments in spacecraft docking systems?",
    "How is the aerospace industry addressing its carbon footprint?",
    "What are the challenges of asteroid mining?",
    "How are advanced materials improving spacecraft heat shields?",
    "What innovations are improving aircraft fuel efficiency?",
    "How is space law evolving with increased commercialization?",
    "What are the latest developments in aircraft electrification?"
  ],
  sustainability: [
    "What are the most promising renewable energy technologies?",
    "How can blockchain improve supply chain sustainability?",
    "Explain carbon capture technologies and their potential",
    "What innovations are helping reduce plastic waste?",
    "How is AI being used to address climate change?",
    "What are the biggest challenges in transitioning to sustainable energy?",
    "How are smart cities incorporating sustainability principles?",
    "What are the latest innovations in solar panel efficiency?",
    "How is sustainable agriculture addressing food security?",
    "What are the best practices in corporate sustainability reporting?",
    "How is the circular economy being implemented across industries?",
    "What are the challenges of scaling green hydrogen production?",
    "How are electric vehicles transforming transportation sustainability?",
    "What are the most innovative approaches to water conservation?",
    "How are carbon markets evolving globally?",
    "What are the sustainable alternatives to conventional plastics?",
    "How is green finance accelerating sustainability initiatives?",
    "What are the challenges of implementing sustainable building standards?",
    "How are companies approaching net-zero emissions targets?",
    "What innovations are improving battery recycling?",
    "How is precision agriculture reducing environmental impact?",
    "What are the social aspects of sustainability beyond environmental concerns?",
    "How is biomimicry informing sustainable design?",
    "What are the challenges of sustainable fashion and textiles?",
    "How is satellite technology monitoring environmental changes?",
    "What are the innovations in sustainable packaging?",
    "How are businesses measuring their carbon footprint accurately?",
    "What are the sustainable solutions for cooling buildings efficiently?",
    "How is biodiversity conservation being integrated into business practices?",
    "What are the challenges of sustainable mining practices?",
    "How is IoT improving resource efficiency in manufacturing?",
    "What are the advancements in sustainable aviation fuels?",
    "How are cities addressing sustainable waste management?",
    "What are the challenges of implementing sustainable tourism?",
    "How is vertical farming addressing sustainability in food production?",
    "What are the innovations in sustainable concrete and construction materials?",
    "How are companies addressing scope 3 emissions in their supply chains?",
    "What are the developments in marine conservation technologies?",
    "How is sustainable investing evolving beyond ESG metrics?",
    "What are the challenges of sustainable water management in agriculture?",
    "How are digital technologies enabling sustainability tracking?",
    "What are the innovations in energy storage beyond lithium-ion batteries?",
    "How are consumer behaviors shifting toward sustainability?",
    "What are the challenges of implementing sustainable forestry practices?",
    "How is synthetic biology contributing to sustainability solutions?",
    "What are the innovations in sustainable cooling technologies?",
    "How are companies implementing internal carbon pricing?",
    "What are the sustainable approaches to rare earth mineral extraction?",
    "How is AI optimizing energy use in buildings and cities?",
    "What are the innovations in sustainable protein sources?"
  ],
  education: [
    "How is AI changing personalized learning?",
    "What are the pros and cons of online education platforms?",
    "Explain the concept of microlearning and its benefits",
    "How are AR and VR being used in educational settings?",
    "What skills will be most important in the future job market?",
    "How can education systems better prepare students for technological change?",
    "What are the most effective models for hybrid learning?",
    "How is gamification enhancing educational outcomes?",
    "What are the challenges of digital equity in education?",
    "How are learning analytics improving educational approaches?",
    "What are the most innovative approaches to STEM education?",
    "How is project-based learning transforming classroom experiences?",
    "What are the benefits of self-directed learning models?",
    "How are educational institutions addressing student mental health?",
    "What are the most promising edtech startups and their innovations?",
    "How is blockchain being used for credential verification?",
    "What are the challenges of implementing adaptive learning systems?",
    "How are schools incorporating coding and computational thinking?",
    "What are the best practices for accessibility in digital learning?",
    "How is peer-to-peer learning being facilitated through technology?",
    "What are the most effective assessment methods in modern education?",
    "How are schools addressing social-emotional learning needs?",
    "What are the innovations in language learning technology?",
    "How is neuroscience informing educational practices?",
    "What are the challenges of implementing competency-based education?",
    "How are educational institutions leveraging big data?",
    "What are the most effective approaches to teacher professional development?",
    "How is global collaboration being fostered in education?",
    "What are the innovations in early childhood education technology?",
    "How are universities reimagining higher education for the future?",
    "What are the challenges of implementing personalized learning at scale?",
    "How is entrepreneurship education evolving?",
    "What are the most effective models for corporate training and upskilling?",
    "How are educational institutions addressing diversity and inclusion?",
    "What are the innovations in special education technology?",
    "How is artificial intelligence transforming educational administration?",
    "What are the best practices for creating engaging remote learning?",
    "How are digital badges and microcredentials changing education?",
    "What are the challenges of measuring educational outcomes accurately?",
    "How are schools incorporating environmental sustainability education?",
    "What are the innovations in music and arts education technology?",
    "How are educational institutions addressing cybersecurity education?",
    "What are the most effective models for flipped classroom implementation?",
    "How is mobile learning transforming educational access?",
    "What are the challenges of implementing critical thinking education?",
    "How are educational institutions addressing the future of work?",
    "What are the innovations in physical education technology?",
    "How are chatbots being used in educational support?",
    "What are the challenges of implementing global citizenship education?",
    "How is education addressing the need for media literacy?"
  ]
};

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [categoryPromptsOrder, setCategoryPromptsOrder] = useLocalStorage<Record<string, number[]>>('categoryPromptsOrder', {});
  const [showPrompts, setShowPrompts] = useState(true);
  
  // Use the shared conversation context
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    handleSubmit,
    setCategoryContext,
    categoryContext
  } = useConversationContext();
  
  // Find the selected category
  const selectedCategory = categories.find((cat) => cat.slug === slug);
  
  // Auto-hide prompts when there are messages or user is typing
  useEffect(() => {
    if (messages.length > 0 || currentMessage.trim().length > 0) {
      setShowPrompts(false);
    }
  }, [messages, currentMessage]);
  
  useEffect(() => {
    // Set the category context when component mounts
    if (selectedCategory) {
      setCategoryContext(selectedCategory.name);
    }
    
    // Clear the category context when component unmounts
    return () => {
      setCategoryContext(null);
    };
  }, [selectedCategory, setCategoryContext]);
  
  // Reset to show prompts when category changes
  useEffect(() => {
    setShowPrompts(true);
  }, [slug]);
  
  if (!selectedCategory) {
    return <div className="p-6">Category not found</div>;
  }

  // Get the actual icon component from lucide-react
  const IconComponent = Icons[selectedCategory.icon as keyof typeof Icons] as React.ElementType;
  
  // Get prompts for this category or use default prompts
  const rawPrompts = categoryPrompts[slug || ''] || categoryPrompts.default;
  
  // Get or create the order for this category's prompts
  useEffect(() => {
    if (!slug) return;
    
    if (!categoryPromptsOrder[slug]) {
      // Create initial shuffled order
      const initialOrder = Array.from({ length: rawPrompts.length }, (_, i) => i);
      const shuffledOrder = shuffleArray(initialOrder);
      setCategoryPromptsOrder({
        ...categoryPromptsOrder,
        [slug]: shuffledOrder
      });
    }
  }, [slug, rawPrompts.length, categoryPromptsOrder, setCategoryPromptsOrder]);
  
  // Get the ordered prompts based on saved order
  const prompts = categoryPromptsOrder[slug || ''] 
    ? categoryPromptsOrder[slug || ''].map(index => rawPrompts[index < rawPrompts.length ? index : 0])
    : rawPrompts;

  const handlePromptClick = (prompt: string) => {
    setCurrentMessage(prompt);
    setShowPrompts(false);  // Hide prompts when selecting one
    
    // Rotate prompts for this category
    if (slug && categoryPromptsOrder[slug]) {
      const currentOrder = [...categoryPromptsOrder[slug]];
      const rotated = [...currentOrder.slice(1), currentOrder[0]]; // Move first to end
      
      setCategoryPromptsOrder({
        ...categoryPromptsOrder,
        [slug]: rotated
      });
    }
    
    // Submit the prompt to conversation
    setTimeout(() => handleSubmit(), 50);
  };

  // Toggle between prompts and conversation view
  const toggleView = () => {
    setShowPrompts(!showPrompts);
  };

  return (
    <div className="p-6 pb-20 w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate("/search")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Categories</span>
          </Button>
        </div>
        
        {/* Toggle button between prompts and conversation */}
        {messages.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleView} 
            className="flex items-center gap-1"
          >
            {showPrompts ? (
              <>
                <MessageSquare className="h-4 w-4" />
                <span>Show Conversation</span>
              </>
            ) : (
              <>
                <Grid3X3 className="h-4 w-4" />
                <span>Show Prompts</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="flex items-center mb-6">
        <div className={`p-3 rounded-full bg-nexus-purple mr-3`}>
          {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
        </div>
        <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {/* Prompt suggestions - shown only when showPrompts is true */}
        <div 
          className={`transition-all duration-300 ${showPrompts ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}
          style={{ height: showPrompts ? 'auto' : '0' }}
        >
          <h3 className="text-lg font-medium mb-3">
            Suggested Questions About {selectedCategory.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {prompts.slice(0, 12).map((prompt, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:bg-secondary/50 transition-colors hover:shadow-md"
                onClick={() => handlePromptClick(prompt)}
              >
                <CardContent className="p-3">
                  <p>{prompt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conversation view - shown when showPrompts is false */}
        <div 
          className={`transition-all duration-300 flex flex-col ${showPrompts ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
          style={{ height: showPrompts ? '0' : '100%' }}
        >
          <div className="flex-1 overflow-auto mb-4 min-h-[200px] relative">
            <ConversationDisplay />
          </div>
        </div>
      </div>
      
      {/* Fixed chat input at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <ChatInput 
          placeholder={`Ask about ${selectedCategory.name}...`} 
          onFocus={() => setShowPrompts(false)}
        />
      </div>
    </div>
  );
};

export default CategoryDetail;
