import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X, Search, User, LogIn, LogOut, LayoutDashboard, Briefcase, Shield, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';

export default function Header() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingOut = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/journals', search: { q: searchQuery } });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/news', label: 'News' },
    { to: '/journals', label: 'Journals' },
    { to: '/editorial-board', label: 'Editorial Board' },
    { to: '/author-guidelines', label: 'Author Guidelines' },
    { to: '/about-contact', label: 'About & Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/generated/agrigence-logo-transparent.dim_200x200.png" alt="Agrigence" className="h-10 w-10" />
            <span className="text-xl font-bold text-primary">Agrigence</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && userProfile && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-64"
                autoFocus
              />
              <Button type="submit" size="sm" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hidden md:inline-flex"
              >
                <Search className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      {userProfile && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-medium">{userProfile.name}</div>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        View Portfolio
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate({ to: '/login' })}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/signup' })}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <nav className="container flex flex-col gap-4 py-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && userProfile && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigate({ to: '/login' });
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate({ to: '/signup' });
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
