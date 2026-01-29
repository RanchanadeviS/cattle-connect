import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NotificationBadgeProps {
  userId?: string;
  className?: string;
}

const NotificationBadge = ({ userId, className }: NotificationBadgeProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Mock unread count for demo
    setUnreadCount(3);

    // In a real app, you would:
    // 1. Fetch unread message count from Supabase
    // 2. Set up real-time subscription for new messages
    // 3. Update count when messages are read

    // Example real-time subscription:
    /*
    const channel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=in.(${userConversationIds.join(',')})`
        },
        (payload) => {
          if (payload.new.sender_id !== userId) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */
  }, [userId]);

  if (unreadCount === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={`h-5 w-5 p-0 flex items-center justify-center text-xs ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default NotificationBadge;