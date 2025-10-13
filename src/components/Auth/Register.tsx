import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { Loader2, Mail, Lock, User, CheckCircle } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Basic field validation
    if (!fullName) {
      toast({
        title: "Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return;
    }

    // Email format validation
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Password complexity validation
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast({
        title: "Error",
        description: "Password must contain at least one uppercase letter.",
        variant: "destructive",
      });
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast({
        title: "Error",
        description: "Password must contain at least one lowercase letter.",
        variant: "destructive",
      });
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast({
        title: "Error",
        description: "Password must contain at least one number.",
        variant: "destructive",
      });
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast({
        title: "Error",
        description: "Password must contain at least one symbol (@$!%*?&).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/register', {
        full_name: fullName,
        email,
        password,
      });

      if (response.data.message || response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Account created successfully! Redirecting to login...",
        });
        
        // Redirect to login after showing success state
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error.response?.data?.message || "Registration failed. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Account Created!</h2>
                  <p className="text-gray-600">
                    Welcome to Content Nova! You'll be redirected to the login page shortly.
                  </p>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-brand">Get Started</h1>
          <p className="text-muted-foreground mt-2">Create your Content Nova account</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to get started with Content Nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be 8+ characters with uppercase, lowercase, number, and symbol
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium bg-clip-text text-transparent bg-gradient-brand hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;