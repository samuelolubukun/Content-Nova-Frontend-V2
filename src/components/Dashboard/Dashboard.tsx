import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import Tabs from './Tabs';
import ContentExtractor from './ContentExtractor';
import ContentGenerator from './ContentGenerator';
import SavedContentManager from './SavedContentManager';
import Feedback from './Feedback';
import Admin from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionBanner from '../Subscription/SubscriptionBanner';
import { useSubscription } from '@/hooks/useSubscription';
import { User, Zap, FileText, Settings, ArrowRight, Sparkles } from 'lucide-react';

interface User {
  id: number;
  email: string;
  full_name: string;
  usertype: number;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('extractor');
  const [showTransition, setShowTransition] = useState(false);
  const { toast } = useToast();
  const subscription = useSubscription();

  useEffect(() => {
    fetchUserData();
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      toast({
        title: 'Subscription Required',
        description: detail?.detail || 'Free tier limit reached. Please subscribe to continue.',
        variant: 'destructive'
      });
    };
    window.addEventListener('subscription:limit', handler as EventListener);
    return () => window.removeEventListener('subscription:limit', handler as EventListener);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    
    // Show transition animation
    setShowTransition(true);
    
    // Switch to generator tab after a brief delay
    setTimeout(() => {
      setActiveTab('generator');
      setShowTransition(false);
      
      // Show success toast with call to action
      toast({
        title: "Content Extracted Successfully! 🎉",
        description: "Ready to repurpose your content? Let's create something amazing!",
        duration: 4000,
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'extractor',
      label: 'Content Extractor',
      icon: <FileText className="w-4 h-4" />,
      content: <ContentExtractor onTextExtracted={handleTextExtracted} />
    },
    {
      id: 'generator',
      label: 'Content Generator',
      icon: <Zap className="w-4 h-4" />,
      content: <ContentGenerator extractedText={extractedText} />
    },
    {
      id: 'saved',
      label: 'Saved Content',
      icon: <User className="w-4 h-4" />,
      content: <SavedContentManager />
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: <Settings className="w-4 h-4" />,
      content: <Feedback user={user} />
    },
  ];

  // Add admin tab if user is admin
  if (user?.usertype === 1) {
    tabs.push({
      id: 'admin',
      label: 'Admin',
      icon: <Settings className="w-4 h-4" />,
      content: <Admin />
    });
  }

  return (
    <div className="min-h-screen bg-muted/30 relative">
      {/* Transition Overlay */}
      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-6 p-8 rounded-xl bg-card shadow-2xl border animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce delay-300"></div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Content Extracted! 🎉
              </h3>
              <p className="text-muted-foreground text-lg">
                Let's repurpose your content!
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <Zap className="w-4 h-4" />
              <span>Switching to Content Generator...</span>
            </div>
            
            <div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-0 animate-[width_1.5s_ease-in-out_forwards]" 
                   style={{
                     animation: 'progressBar 1.5s ease-in-out forwards'
                   }}>
              </div>
            </div>
            
            <style>{`
              @keyframes progressBar {
                0% { width: 0%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
  <SubscriptionBanner status={subscription} />
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back, {user?.full_name}!
              </CardTitle>
              <p className="text-muted-foreground">
                Ready to create amazing content? Let's get started.
              </p>
            </CardHeader>
          </Card>
        </div>



        {/* Main Dashboard */}
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Dashboard;