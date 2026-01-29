import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PriceOfferDialog from "@/components/messaging/PriceOfferDialog";
import farmerAvatar1 from "@/assets/farmer-avatar-1.jpg";
import farmerAvatar2 from "@/assets/farmer-avatar-2.jpg";
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  IndianRupee,
  Phone,
  MoreVertical,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  cattle_id: number;
  seller_id: string;
  buyer_id: string;
  status: string;
  updated_at: string;
  cattle_name?: string;
  other_user_name?: string;
  other_user_avatar?: string;
  last_message?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  price_offer?: number;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock user for demo - in real app would get from auth
  useEffect(() => {
    // For demo purposes, we'll use a mock user
    setCurrentUser({
      id: "user-123",
      name: "John Doe",
      avatar: farmerAvatar1
    });
  }, []);

  // Mock data for demo
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        cattle_id: 1,
        seller_id: "seller-1",
        buyer_id: "user-123",
        status: "active",
        updated_at: new Date().toISOString(),
        cattle_name: "Holstein Dairy Cow",
        other_user_name: "Ram Singh Farm",
        other_user_avatar: farmerAvatar2,
        last_message: "Great! When can we arrange the viewing?",
        unread_count: 2
      },
      {
        id: "conv-2",
        cattle_id: 2,
        seller_id: "seller-2",
        buyer_id: "user-123",
        status: "active",
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        cattle_name: "Gir Bull",
        other_user_name: "Patel Dairy",
        other_user_avatar: farmerAvatar1,
        last_message: "The price seems reasonable. Let me think about it.",
        unread_count: 0
      }
    ];

    const mockMessages: Message[] = [
      {
        id: "msg-1",
        conversation_id: "conv-1",
        sender_id: "user-123",
        message_type: "text",
        content: "Hi, I'm interested in your Holstein cow. Is it still available?",
        is_read: true,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        sender_name: "John Doe",
        sender_avatar: farmerAvatar1
      },
      {
        id: "msg-2",
        conversation_id: "conv-1",
        sender_id: "seller-1",
        message_type: "text",
        content: "Yes, it's still available! She's a very healthy cow with excellent milk production.",
        is_read: true,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        sender_name: "Ram Singh Farm",
        sender_avatar: farmerAvatar2
      },
      {
        id: "msg-3",
        conversation_id: "conv-1",
        sender_id: "user-123",
        message_type: "price_offer",
        content: "I'd like to make an offer",
        price_offer: 80000,
        is_read: true,
        created_at: new Date(Date.now() - 1800000).toISOString(),
        sender_name: "John Doe",
        sender_avatar: farmerAvatar1
      },
      {
        id: "msg-4",
        conversation_id: "conv-1",
        sender_id: "seller-1",
        message_type: "text",
        content: "That's a bit low for this quality. The current asking price is ₹85,000. Can you do ₹82,000?",
        is_read: false,
        created_at: new Date(Date.now() - 900000).toISOString(),
        sender_name: "Ram Singh Farm",
        sender_avatar: farmerAvatar2
      },
      {
        id: "msg-5",
        conversation_id: "conv-1",
        sender_id: "seller-1",
        message_type: "text",
        content: "Great! When can we arrange the viewing?",
        is_read: false,
        created_at: new Date(Date.now() - 300000).toISOString(),
        sender_name: "Ram Singh Farm",
        sender_avatar: farmerAvatar2
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
    setLoading(false);

    // Auto-select conversation from URL params
    const conversationId = searchParams.get("conversation");
    if (conversationId) {
      setSelectedConversation(conversationId);
    } else if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0].id);
    }
  }, [searchParams]);

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversation_id === selectedConversation);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: selectedConversation,
      sender_id: currentUser.id,
      message_type: "text",
      content: newMessage,
      is_read: true,
      created_at: new Date().toISOString(),
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    toast({
      title: "Message sent",
      description: "Your message has been delivered successfully.",
    });
  };

  const sendPriceOffer = (amount: number) => {
    if (!selectedConversation || !currentUser) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: selectedConversation,
      sender_id: currentUser.id,
      message_type: "price_offer",
      content: "I'd like to make an offer",
      price_offer: amount,
      is_read: true,
      created_at: new Date().toISOString(),
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar
    };

    setMessages(prev => [...prev, message]);

    toast({
      title: "Price offer sent",
      description: `Your offer of ₹${amount.toLocaleString()} has been sent.`,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-muted-foreground">Communicate with buyers and sellers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.other_user_avatar} />
                          <AvatarFallback>
                            {conversation.other_user_name?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {conversation.other_user_name}
                            </p>
                            {conversation.unread_count && conversation.unread_count > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.cattle_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {conversation.last_message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(conversation.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedConv.other_user_avatar} />
                        <AvatarFallback>
                          {selectedConv.other_user_name?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedConv.other_user_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          About: {selectedConv.cattle_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === currentUser?.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              message.sender_id === currentUser?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            } rounded-lg p-3`}
                          >
                            {message.message_type === "price_offer" ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-4 w-4" />
                                  <span className="font-medium">Price Offer</span>
                                </div>
                                <p className="text-lg font-bold">
                                  ₹{message.price_offer?.toLocaleString()}
                                </p>
                                {message.sender_id !== currentUser?.id && (
                                  <div className="flex gap-2 mt-3">
                                    <Button size="sm" variant="secondary">
                                      Accept
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Counter
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      Decline
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : message.message_type === "image" ? (
                              <div className="space-y-2">
                                <Image className="h-4 w-4" />
                                <img
                                  src={message.file_url}
                                  alt="Shared image"
                                  className="rounded max-w-full"
                                />
                                {message.content && <p>{message.content}</p>}
                              </div>
                            ) : message.message_type === "document" ? (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{message.file_name}</span>
                              </div>
                            ) : (
                              <p>{message.content}</p>
                            )}
                            <p className="text-xs opacity-70 mt-2">
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator />

                  {/* Message Input */}
                  <div className="p-4">
                    <div className="space-y-2 mb-2">
                      <PriceOfferDialog
                        originalPrice={85000}
                        onSendOffer={sendPriceOffer}
                        trigger={
                          <Button variant="outline" size="sm">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            Make Offer
                          </Button>
                        }
                      />
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-1" />
                        Attach
                      </Button>
                      <Button variant="outline" size="sm">
                        <Image className="h-4 w-4 mr-1" />
                        Photo
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;