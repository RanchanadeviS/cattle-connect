import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Search, 
  MessageCircle, 
  BarChart3,
  MessageSquare,
  User,
  Menu,
  ListPlus,
  UserPlus
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationBadge from "@/components/messaging/NotificationBadge";
import { useState } from "react";

const DesktopHeader = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  // ✅ Main navigation (top & bottom)
  const mainNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Browser", icon: Search },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/health-records", label: "Health", icon: MessageSquare },
    { path: "/messages", label: "Message", icon: MessageCircle, hasNotification: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              H
            </div>
            <span className="text-xl font-bold hidden sm:inline">HerdHub</span>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2 flex-1 justify-center">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="relative px-4"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.hasNotification && (
                      <div className="absolute -top-1 -right-1">
                        <NotificationBadge userId="user-123" />
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Hamburger Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 bg-background z-[100]">
                <div className="flex flex-col gap-3 mt-8">
                  {/* Only essential menu items */}
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>

                  <Link to="/add-user" onClick={() => setMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </Link>

                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </Link>

                  <div className="border-t pt-3 mt-2">
                    <Link to="/auth" onClick={() => setMenuOpen(false)}>
                      <Button variant="secondary" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
            <div className="flex items-center justify-around py-2 px-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className="relative">
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="flex-col h-auto py-2 px-3"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.label}</span>
                      {item.hasNotification && (
                        <div className="absolute -top-1 -right-1">
                          <NotificationBadge userId="user-123" />
                        </div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
