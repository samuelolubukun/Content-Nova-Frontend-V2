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
import { User, Zap, FileText, Settings } from 'lucide-react';

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
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
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
      content: <ContentExtractor onTextExtracted={setExtractedText} />
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
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
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
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Dashboard;