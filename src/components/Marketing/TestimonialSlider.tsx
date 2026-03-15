
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Crypto Investor",
    avatar: "SJ",
    quote: "TMRW W3AI Browser has completely transformed my Web3 experience. The built-in wallet connections and dApp integration make managing my assets so much easier.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "DeFi Developer",
    avatar: "MC",
    quote: "As a developer, I appreciate the powerful dev tools and seamless integration with Web3 libraries. Testing smart contracts has never been this smooth.",
    rating: 5
  },
  {
    name: "Aisha Williams",
    role: "NFT Artist",
    avatar: "AW",
    quote: "The security features give me peace of mind when connecting to marketplaces, and the NFT preview feature is something I didn't know I needed until now!",
    rating: 4
  },
  {
    name: "Thomas Rodriguez",
    role: "Privacy Advocate",
    avatar: "TR",
    quote: "Finally a browser that takes privacy seriously while still being fully functional with Web3. The tracker blocking is the best I've seen.",
    rating: 5
  }
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
          Trusted By Web3 Users
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="p-6">
                  <div className="pt-6 px-4">
                    <div className="flex items-center justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-center text-lg mb-8 text-gray-300 italic">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex flex-col items-center">
                      <Avatar className="h-16 w-16 mb-4 border-2 border-nexus-blue">
                        <AvatarFallback className="bg-nexus-blue/20 text-nexus-light-blue">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-medium text-xl">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-1/2 -left-4 transform -translate-y-1/2 rounded-full bg-transparent border-nexus-blue/20"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-full bg-transparent border-nexus-blue/20"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
