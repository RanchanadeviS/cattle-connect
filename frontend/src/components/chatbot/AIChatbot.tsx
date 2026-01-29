import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  quickActions?: Array<{ label: string; action: string }>;
}

interface ResponsePattern {
  patterns: string[];
  response: string;
  quickActions?: Array<{ label: string; action: string }>;
  category: string;
}

const responseDatabase: ResponsePattern[] = [
  // Welcome & General
  {
    patterns: ["hello", "hi", "hey", "start", "help"],
    response: "Hello! 👋 I'm your HerdHub AI assistant. I can help you with:\n\n• 🐄 **Cattle Health** - Vaccinations, health records, vet appointments\n• 💰 **Buying & Selling** - List cattle, search, negotiate prices\n• 📊 **Market Insights** - Current prices, trends, demand\n• 👤 **Account Help** - Profile setup, verification\n• 💬 **Messages** - Communication between buyers/sellers\n\nWhat would you like to know?",
    category: "general",
    quickActions: [
      { label: "Sell Cattle", action: "How do I sell cattle?" },
      { label: "Health Records", action: "Tell me about health monitoring" },
      { label: "Market Prices", action: "What are current cattle prices?" }
    ]
  },

  // Selling Process
  {
    patterns: ["sell", "list", "post", "create listing", "sell cattle", "sell cow", "how to sell"],
    response: "**How to List Cattle for Sale on HerdHub:**\n\n1. **Create Listing** - Click 'Create Listing' from your dashboard\n2. **Basic Information** - Enter breed, age, weight, milk capacity\n3. **Upload Photos** - Add clear photos (min 3 recommended)\n4. **Health Records** - Upload vaccination certificates and health documents\n5. **Set Price** - Enter your asking price or choose auction mode\n6. **Location** - Set pickup location and delivery preferences\n7. **Publish** - Review and publish your listing\n\n💡 **Tips:**\n• Clear photos increase interest by 60%\n• Complete health records build trust\n• Competitive pricing gets faster responses\n• Update listing status regularly",
    category: "selling",
    quickActions: [
      { label: "Pricing Guide", action: "What are current prices?" },
      { label: "Photo Tips", action: "How to take good cattle photos?" }
    ]
  },

  // Health Monitoring
  {
    patterns: ["health", "vaccine", "vaccination", "vet", "doctor", "sick", "disease", "medical"],
    response: "**Cattle Health Management on HerdHub:**\n\n🏥 **Health Records Dashboard**\n• View all health documents in one place\n• Upload vaccination certificates\n• Track vaccination schedules\n• Set reminders for upcoming shots\n\n💉 **Vaccination Tracking**\n• FMD (Foot & Mouth Disease) - Every 6 months\n• Brucellosis - Annual\n• Black Quarter - Annual\n• Anthrax - Annual\n\n📅 **Vet Appointments**\n• Schedule appointments with registered vets\n• Get reminders 24 hours before\n• Access appointment history\n\n✅ **Health Verification**\n• All documents verified by system\n• Builds buyer confidence\n• Reduces transaction disputes by 70%",
    category: "health",
    quickActions: [
      { label: "View Health Records", action: "Go to health records" },
      { label: "Schedule Vet Visit", action: "How to book vet appointment?" }
    ]
  },

  // Buying Process
  {
    patterns: ["buy", "purchase", "search", "find cattle", "browse", "looking for"],
    response: "**How to Buy Cattle on HerdHub:**\n\n🔍 **Search & Browse**\n1. Use filters: breed, location, price range, milk yield\n2. View detailed cattle profiles with photos\n3. Check seller ratings and reviews\n4. Review complete health records\n\n💬 **Contact & Negotiate**\n1. Message seller through in-app chat\n2. Use price negotiation feature\n3. Request video calls for inspection\n4. Discuss delivery arrangements\n\n✅ **Verification Checklist**\n• ✓ Check vaccination certificates\n• ✓ Verify seller credentials\n• ✓ Review cattle history\n• ✓ Physical inspection before purchase\n• ✓ Use escrow payment for safety\n\n💰 **Payment**\n• Secure payment gateway\n• Escrow protection available\n• Digital receipts generated",
    category: "buying"
  },

  // Market Prices & Trends
  {
    patterns: ["price", "cost", "market", "trend", "value", "worth", "expensive", "cheap"],
    response: "**Current Cattle Market Prices (₹):**\n\n🐄 **Dairy Cows**\n• Holstein: ₹80,000 - ₹1,00,000\n• Jersey: ₹55,000 - ₹75,000\n• Gir: ₹60,000 - ₹90,000\n• Sahiwal: ₹65,000 - ₹85,000\n\n🐃 **Buffaloes**\n• Murrah: ₹70,000 - ₹95,000\n• Nili-Ravi: ₹65,000 - ₹85,000\n\n📈 **Market Trends**\n• High milk producers (25L+) command 30% premium\n• Demand peaks October-February\n• Verified health records increase value by 15-20%\n• Young cattle (2-4 years) most in demand\n\n💡 **Price Factors:**\n• Age & health condition\n• Milk production capacity\n• Breed purity\n• Location & demand\n• Breeding history",
    category: "market"
  },

  // Breeds Information
  {
    patterns: ["breed", "type", "species", "variety", "holstein", "jersey", "gir", "sahiwal"],
    response: "**Popular Cattle Breeds on HerdHub:**\n\n🥛 **High Milk Production**\n• **Holstein** - 25-30L/day, low fat content\n• **Jersey** - 18-22L/day, high fat content (5%)\n• **Gir** - 15-20L/day, indigenous, disease resistant\n• **Sahiwal** - 12-18L/day, heat tolerant\n\n🐃 **Buffalo Breeds**\n• **Murrah** - 15-18L/day, highest fat content\n• **Nili-Ravi** - 12-16L/day, adaptable\n\n🔍 **Choosing the Right Breed:**\n• Climate considerations\n• Milk requirement vs market\n• Feed availability & cost\n• Disease resistance\n• Local demand patterns\n\n💰 Use filters on Browse page to find specific breeds!",
    category: "breeds"
  },

  // Cattle Care
  {
    patterns: ["care", "feed", "feeding", "food", "nutrition", "maintain", "keep healthy"],
    response: "**Proper Cattle Care Guide:**\n\n🌾 **Feeding (Daily)**\n• Green fodder: 40-50 kg\n• Dry fodder: 5-7 kg\n• Concentrate feed: 3-5 kg\n• Fresh water: 80-100 liters\n• Cost: ₹200-300/day per animal\n\n🏠 **Housing**\n• Clean, well-ventilated shelter\n• 100 sq ft per adult cattle\n• Regular cleaning & disinfection\n• Proper drainage system\n\n💉 **Health Management**\n• Regular deworming (every 3 months)\n• Hoof trimming (every 6 months)\n• Body condition monitoring\n• Immediate vet consultation if sick\n\n🏃 **Exercise & Hygiene**\n• Daily exercise for 2-3 hours\n• Regular bathing in summer\n• Brush coat daily\n• Check for ticks/parasites\n\n📊 Use HerdHub Health Records to track all care activities!",
    category: "care"
  },

  // Account & Profile
  {
    patterns: ["account", "profile", "verify", "verification", "register", "sign up", "kyc"],
    response: "**Account Management:**\n\n👤 **Profile Setup**\n• Add profile photo\n• Enter contact details\n• Set location (improves search visibility)\n• Write bio about your farm/business\n\n✅ **Verification Process**\n• Upload government ID\n• Verify phone number via OTP\n• Business registration (for traders)\n• Get blue verification badge\n\n⭐ **Build Your Reputation**\n• Complete profile = 40% more responses\n• Verified users get priority in search\n• Ratings improve with successful transactions\n• Respond quickly to messages\n\n🔒 **Security**\n• Enable two-factor authentication\n• Regular password updates\n• Secure payment methods only\n• Report suspicious activity",
    category: "account"
  },

  // Messages & Communication
  {
    patterns: ["message", "chat", "communicate", "contact", "talk", "negotiate", "offer"],
    response: "**Messaging & Negotiation:**\n\n💬 **In-App Chat**\n• Direct messaging with buyers/sellers\n• Share photos and documents\n• Real-time notifications\n• Conversation history saved\n\n💰 **Price Negotiation**\n• Use built-in negotiation feature\n• Make counter-offers\n• Track negotiation history\n• Agree on final price in-app\n\n📹 **Video Inspection**\n• Request live video calls\n• Inspect cattle remotely\n• Ask questions in real-time\n• Record sessions for reference\n\n🔔 **Notifications**\n• Get alerts for new messages\n• Reminder for pending responses\n• Transaction updates\n• Appointment reminders",
    category: "messages"
  },

  // Analytics & Insights
  {
    patterns: ["analytics", "insight", "report", "statistics", "data", "performance"],
    response: "**Market Analytics Dashboard:**\n\n📊 **Your Performance**\n• Total listings & active listings\n• Views and engagement metrics\n• Response rate & time\n• Successful transactions\n• Earnings overview\n\n📈 **Market Insights**\n• Real-time price trends\n• Demand patterns by region\n• Best selling breeds\n• Seasonal variations\n• Competition analysis\n\n💡 **AI Recommendations**\n• Optimal pricing suggestions\n• Best time to sell\n• Popular features buyers want\n• Listing improvement tips\n\n🎯 **View detailed analytics in your Dashboard!**",
    category: "analytics"
  },

  // Technical Support
  {
    patterns: ["problem", "issue", "error", "not working", "help", "support", "bug", "technical"],
    response: "**Technical Support:**\n\n🛠️ **Common Issues & Solutions**\n\n**Can't upload photos?**\n• Check file size (<5MB per photo)\n• Supported formats: JPG, PNG, WebP\n• Clear browser cache\n• Try different browser\n\n**Payment not working?**\n• Verify payment method details\n• Check bank/card status\n• Ensure sufficient balance\n• Contact support if issue persists\n\n**Messages not sending?**\n• Check internet connection\n• Refresh the page\n• Clear browser cache\n\n📧 **Contact Support**\n• Email: support@herdhub.com\n• Response time: 24 hours\n• Include screenshots if possible\n• Provide listing ID for faster help",
    category: "support"
  },

  // Auction Mode
  {
    patterns: ["auction", "bid", "bidding", "live auction"],
    response: "**Live Auction Feature:**\n\n⏰ **How Auctions Work**\n1. Seller sets starting price & auction duration\n2. Buyers place bids in real-time\n3. Highest bidder wins when timer ends\n4. Automatic outbid notifications\n5. Winner gets 24 hours to complete payment\n\n💡 **For Sellers:**\n• Set reserve price (minimum acceptable)\n• Choose auction duration (1-7 days)\n• Monitor bids in real-time\n• 10% higher final prices on average\n\n💰 **For Buyers:**\n• Set max bid for auto-bidding\n• Get notifications when outbid\n• Last-minute bidding allowed\n• Secure payment through escrow\n\n🎯 Check active auctions on Browse page!",
    category: "auction"
  }
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your HerdHub AI assistant. I can help you with cattle health, buying/selling, market insights, and more. What would you like to know?",
      timestamp: new Date(),
      quickActions: [
        { label: "Sell Cattle", action: "How do I sell cattle?" },
        { label: "Health Records", action: "Tell me about health monitoring" },
        { label: "Current Prices", action: "What are current cattle prices?" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userInput: string): ResponsePattern | null => {
    const lowerInput = userInput.toLowerCase();
    
    // Find all matching patterns
    const matches = responseDatabase.map(pattern => {
      const matchCount = pattern.patterns.filter(p => 
        lowerInput.includes(p.toLowerCase())
      ).length;
      return { pattern, matchCount };
    }).filter(m => m.matchCount > 0);

    // Return best match (highest match count)
    if (matches.length > 0) {
      matches.sort((a, b) => b.matchCount - a.matchCount);
      return matches[0].pattern;
    }

    return null;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 800));

    const bestMatch = findBestResponse(input);
    
    let response: Message;
    if (bestMatch) {
      response = {
        role: "assistant",
        content: bestMatch.response,
        timestamp: new Date(),
        quickActions: bestMatch.quickActions
      };
    } else {
      response = {
        role: "assistant",
        content: "I'd love to help! I can assist with:\n\n• 🐄 Cattle health & vaccinations\n• 💰 Buying & selling cattle\n• 📊 Market prices & trends\n• 👤 Account management\n• 💬 Using the messaging system\n• 📈 Analytics & insights\n\nCould you rephrase your question or choose one of the topics above?",
        timestamp: new Date(),
        quickActions: [
          { label: "Sell Cattle", action: "How do I sell cattle?" },
          { label: "Buy Cattle", action: "How do I buy cattle?" },
          { label: "Market Prices", action: "What are current prices?" }
        ]
      };
    }

    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => handleSend(), 100);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date(),
        quickActions: [
          { label: "Sell Cattle", action: "How do I sell cattle?" },
          { label: "Health Records", action: "Tell me about health monitoring" },
          { label: "Current Prices", action: "What are current cattle prices?" }
        ]
      }
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">HerdHub Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">AI</Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-8 w-8 hover:bg-primary-foreground/10"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-primary-foreground/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    <div
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`rounded-lg px-4 py-3 max-w-[85%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                          {message.content}
                        </p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.role === "assistant" && message.quickActions && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-0">
                        {message.quickActions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.action)}
                            className="text-xs h-7"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area - Fixed at Bottom */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSend} 
                  size="icon"
                  disabled={isTyping || !input.trim()}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
