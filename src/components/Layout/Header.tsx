import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { isAuthenticated, logout } from '@/utils/auth';
import { LogOut, Home, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group ml-[-16px]">
            <img 
              src="/contentnova.jpg" 
              alt="Content Nova Logo" 
              className="h-8 w-auto object-contain group-hover:opacity-90 transition-all duration-200" 
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {authenticated && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {!authenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-gradient-brand text-white hover:opacity-90 transition-opacity" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;