import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Search, 
  MessageCircle, 
  User,
  BarChart3,
  MessageSquare,
  Menu,
  LogIn,
  PlusCircle // 🆕 add this icon
} from "lucide-react";
import NotificationBadge from "@/components/messaging/NotificationBadge";

const MainNavigation = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home
    },
    {
      path: "/search",
      label: "Browse",
      icon: Search
    },
    {
      path: "/listings/create", // 🆕 Sell Cattle Page
      label: "Sell",
      icon: PlusCircle
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3
    },
    {
      path: "/health-records",
      label: "Health",
      icon: MessageSquare
    },
    {
      path: "/messages",
      label: "Messages",
      icon: MessageCircle,
      hasNotification: true
    },
    {
      path: "/auth",
      label: "Sign In",
      icon: LogIn
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 lg:hidden">
      <div className="flex justify-around items-center py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className="w-full flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 relative text-xs"
              >
                <div className="relative">
                  <Icon className="h-4 w-4" />
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1">
                      <NotificationBadge userId="user-123" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] leading-tight">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MainNavigation;
