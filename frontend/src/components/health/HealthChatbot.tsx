import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, UserIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const HealthChatbot = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages();
    }
  }, [currentConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await supabase
        .from('health_chat_conversations')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      setConversations(data || []);
      
      if (data && data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async () => {
    if (!currentConversation) return;

    try {
      const { data } = await supabase
        .from('health_chat_messages')
        .select('*')
        .eq('conversation_id', currentConversation)
        .order('created_at');

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('health_chat_conversations')
        .insert({
          user_id: user?.id,
          title: 'New Health Consultation'
        })
        .select()
        .single();

      if (error) throw error;

      setConversations([data, ...conversations]);
      setCurrentConversation(data.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create new conversation');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      // Add user message to database
      const { data: userMessageData, error: userError } = await supabase
        .from('health_chat_messages')
        .insert({
          conversation_id: currentConversation,
          message: userMessage,
          is_user: true
        })
        .select()
        .single();

      if (userError) throw userError;

      // Update messages immediately
      setMessages(prev => [...prev, userMessageData]);

      // Call AI assistant (simulated response for now)
      const aiResponse = await getAIResponse(userMessage);

      // Add AI response to database
      const { data: aiMessageData, error: aiError } = await supabase
        .from('health_chat_messages')
        .insert({
          conversation_id: currentConversation,
          message: aiResponse,
          is_user: false
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setMessages(prev => [...prev, aiMessageData]);

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = userMessage.length > 30 ? userMessage.substring(0, 30) + '...' : userMessage;
        await supabase
          .from('health_chat_conversations')
          .update({ title })
          .eq('id', currentConversation);
        
        fetchConversations();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI responses based on common cattle health queries
    const responses: { [key: string]: string } = {
      "vaccination": "For cattle vaccinations, I recommend following a regular schedule. Common vaccines include FMD (Foot and Mouth Disease), Anthrax, and Blackleg. Consult with your local veterinarian for the best vaccination program for your region and cattle type.",
      
      "fever": "If your cattle has a fever, monitor their temperature regularly. Normal body temperature for cattle is 101.5°F (38.6°C). Signs include lethargy, loss of appetite, and warm ears. Contact a veterinarian immediately if fever persists above 103°F (39.4°C).",
      
      "pregnancy": "Pregnancy check should be done 30-60 days after breeding. Watch for signs like cessation of heat cycles, behavioral changes, and gradual weight gain. Provide proper nutrition with increased protein and minerals during pregnancy.",
      
      "nutrition": "Proper cattle nutrition includes quality forage, adequate protein (8-12% for maintenance), minerals (especially calcium and phosphorus), and fresh water. Adjust nutrition based on production stage, age, and body condition.",
      
      "lameness": "Lameness in cattle can be caused by foot rot, sole ulcers, or injuries. Examine hooves regularly, keep areas clean and dry, and trim hooves as needed. Severe cases require veterinary attention and may need antibiotics.",
      
      "diarrhea": "Diarrhea in cattle can indicate parasites, dietary issues, or infections. Ensure access to clean water, check for dehydration, and collect fecal samples for testing. Severe cases may require electrolyte therapy and veterinary care.",
    };

    const lowercaseMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowercaseMessage.includes(keyword)) {
        return response;
      }
    }

    // Default response for unmatched queries
    return "I understand you have a question about cattle health. While I can provide general guidance, I always recommend consulting with a qualified veterinarian for specific health concerns. They can provide proper diagnosis and treatment plans tailored to your cattle's needs. Is there a specific symptom or condition you'd like me to help with?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Conversations Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Button size="sm" onClick={createNewConversation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[480px]">
            <div className="space-y-2 p-4 pt-0">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                  <Button size="sm" className="mt-2" onClick={createNewConversation}>
                    Start Chat
                  </Button>
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversation === conv.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setCurrentConversation(conv.id)}
                  >
                    <p className="font-medium text-sm truncate">{conv.title}</p>
                    <p className="text-xs opacity-70">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            AI Health Assistant
            <Badge variant="secondary" className="ml-2">Cattle Health Expert</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get instant guidance on cattle health, vaccinations, and veterinary care
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {currentConversation ? (
            <>
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-medium mb-2">Welcome to AI Health Assistant</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        I can help you with cattle health questions, vaccination schedules, and general veterinary guidance.
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Try asking:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Badge variant="outline" className="text-xs">Vaccination schedule</Badge>
                          <Badge variant="outline" className="text-xs">Fever symptoms</Badge>
                          <Badge variant="outline" className="text-xs">Pregnancy care</Badge>
                          <Badge variant="outline" className="text-xs">Nutrition guide</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.is_user ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.is_user ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.is_user ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {message.is_user ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.is_user 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about cattle health, symptoms, treatments..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This AI assistant provides general guidance. Always consult a qualified veterinarian for specific health concerns.
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[480px]">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select a conversation or start a new one</p>
                <Button className="mt-4" onClick={createNewConversation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthChatbot;