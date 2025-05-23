import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ChevronDown,
  Cog,
  CreditCard,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  PenLine,
  Users,
  X,
  Layers,
  BarChart4,
  LayoutDashboard,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CustomerNavigationProps {
  companyName?: string;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export function CustomerNavigation({
  companyName = "Premium Home Services",
  userName = "User",
  userEmail = "user@example.com",
  onLogout = () => console.log("Logout clicked"),
  children
}: CustomerNavigationProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define sidebar navigation links
  const sidebarLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customize Widget', href: '/customize', icon: PenLine },
    { name: 'Revenue Streams', href: '/revenue', icon: BarChart3 },
    { name: 'Customer Management', href: '/customers', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart4 },
    { name: 'Billing & Plan', href: '/billing', icon: CreditCard },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ];

  // Check if the current path matches the link
  const isActive = (path: string) => location === path || location.startsWith(path);

  // Get initials from name for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center space-x-2"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">SP</div>
                      </div>
                      <span className="font-bold">ServicePlan Pro</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4 py-6">
                    {sidebarLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center space-x-3 px-2 py-2 text-base transition-colors hover:text-primary ${
                          isActive(link.href) ? 'text-primary font-medium' : 'text-muted-foreground'
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <link.icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-auto border-t pt-4">
                    <p className="px-2 py-1 text-sm text-muted-foreground">{companyName}</p>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-2 py-2 text-base text-muted-foreground" 
                      onClick={onLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">SP</div>
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">ServicePlan Pro</span>
            </Link>

            {/* Company name */}
            <div className="hidden md:flex items-center border-l pl-4">
              <span className="text-sm text-muted-foreground">{companyName}</span>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Cog className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/support" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-background">
          <div className="flex flex-col gap-1 p-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive(link.href) ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                <link.icon className="mr-3 h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default CustomerNavigation;