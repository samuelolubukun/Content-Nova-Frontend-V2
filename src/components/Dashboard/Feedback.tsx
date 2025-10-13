import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { Loader2, MessageCircle, Send, CheckCircle } from 'lucide-react';

interface User {
  id: number;
  email: string;
  full_name: string;
  usertype: number;
  created_at: string;
}

interface FeedbackProps {
  user: User | null;
}

const Feedback: React.FC<FeedbackProps> = ({ user }) => {
  const [name, setName] = useState(user?.full_name || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/feedback', {
        name: name.trim(),
        message: message.trim(),
      });

      setIsSubmitted(true);
      setMessage('');
      toast({
        title: "Success",
        description: "Thank you for your feedback! We appreciate your input.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="card-gradient border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Thank You!</h3>
            <p className="text-muted-foreground mb-6">
              Your feedback has been submitted successfully. We value your input and will use it to improve Content Nova.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitted(false)}
            >
              Submit More Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-gradient border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Share Your Feedback</span>
          </CardTitle>
          <CardDescription>
            Help us improve Content Nova by sharing your thoughts, suggestions, or reporting issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Share your feedback, suggestions, or report any issues you've encountered..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim() || !message.trim()}
              variant="hero"
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback Guidelines */}
      <Card className="card-gradient border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Feedback Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">What to include:</h4>
              <ul className="mt-2 space-y-1 text-muted-foreground ml-4">
                <li>• Specific features you'd like to see</li>
                <li>• Issues or bugs you've encountered</li>
                <li>• Suggestions for improving the user experience</li>
                <li>• Overall thoughts on Content Nova</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
