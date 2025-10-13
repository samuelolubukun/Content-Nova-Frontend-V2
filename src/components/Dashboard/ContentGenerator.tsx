import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { 
  Loader2, 
  Copy, 
  Save, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Twitter, 
  FileText, 
  BookOpen, 
  Mail,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentGeneratorProps {
  extractedText: string;
}

interface GeneratedContent {
  platform: string;
  content: string;
  icon: React.ReactNode;
  platformId: string;
}

const platforms = [
  { id: 'video-script', name: 'Video Script', icon: <Youtube className="w-5 h-5 text-red-600" /> },
  { id: 'instagram-caption', name: 'Instagram Caption', icon: <Instagram className="w-5 h-5 text-pink-600" /> },
  { id: 'linkedin-post', name: 'LinkedIn Post', icon: <Linkedin className="w-5 h-5 text-blue-600" /> },
  { id: 'tweet', name: 'Tweet', icon: <Twitter className="w-5 h-5 text-blue-400" /> },
  { id: 'article', name: 'Article', icon: <FileText className="w-5 h-5 text-gray-600" /> },
  { id: 'blog-post', name: 'Blog Post', icon: <BookOpen className="w-5 h-5 text-green-600" /> },
  { id: 'newsletter', name: 'Newsletter', icon: <Mail className="w-5 h-5 text-purple-600" /> },
];

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ extractedText }) => {
  const [inputText, setInputText] = useState(extractedText || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['video-script']);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingContentId, setSavingContentId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveConfig, setSaveConfig] = useState({ platformId: '', title: '', tags: '' });
  const { toast } = useToast();

  // Update input text when extracted text changes
  useEffect(() => {
    if (extractedText && extractedText !== inputText) {
      setInputText(extractedText);
    }
  }, [extractedText]);

  // Clean markdown formatting function (from working version)
  const cleanMarkdownFormatting = (text: string): string => {
    if (!text) return '';
    
    let cleanText = text.replace(/^#+\s+/gm, '');
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1');
    cleanText = cleanText.replace(/\*(.*?)\*/g, '$1');
    cleanText = cleanText.replace(/^\s*[\*\-]\s+/gm, '');
    cleanText = cleanText.replace(/^\s*\d+\.\s+/gm, '');
    cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
    cleanText = cleanText.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1');
    });
    cleanText = cleanText.replace(/^\s*>\s+/gm, '');
    cleanText = cleanText.replace(/^\s*[-*_]{3,}\s*$/gm, '\n');
    cleanText = cleanText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    
    return cleanText;
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const generateAllContent = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate content",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);

    try {
      const results: GeneratedContent[] = [];

      // Generate content for each selected platform
      await Promise.all(selectedPlatforms.map(async (platformId) => {
        try {
          const response = await api.post(`/generate/${platformId}`, {
            text: inputText
          });

          if (response.data.generated_text) {
            const platformInfo = platforms.find(p => p.id === platformId);
            
            if (platformInfo) {
              results.push({
                platform: platformInfo.name,
                content: cleanMarkdownFormatting(response.data.generated_text),
                icon: platformInfo.icon,
                platformId: platformId
              });
            }
          }
        } catch (error: any) {
          console.error(`Error generating ${platformId}:`, error);
          toast({
            title: "Generation Error",
            description: `Failed to generate content for ${platformId}: ${error.response?.data?.detail || error.message}`,
            variant: "destructive",
          });
        }
      }));

      setGeneratedContent(results);
      
      if (results.length > 0) {
        toast({
          title: "Success",
          description: `Generated content for ${results.length} platform${results.length > 1 ? 's' : ''}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (content: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: `${platform} content copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleSaveContent = (platformId: string, platform: string) => {
    setSaveConfig({
      platformId,
      title: `${platform} - ${new Date().toLocaleDateString()}`,
      tags: ''
    });
    setShowSaveModal(true);
  };

  const confirmSaveContent = async () => {
    const { platformId, title, tags } = saveConfig;
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the content",
        variant: "destructive",
      });
      return;
    }

    const contentItem = generatedContent.find(item => item.platformId === platformId);
    if (!contentItem) return;

    setSavingContentId(platformId);
    
    try {
      // Platform mapping for backend
      const platformMap: { [key: string]: string } = {
        'video-script': 'youtube_script',
        'instagram-caption': 'instagram_caption',
        'linkedin-post': 'linkedin_post',
        'tweet': 'tweet',
        'blog-post': 'blog_post',
        'article': 'article',
        'newsletter': 'newsletter'
      };

      const saveData = {
        title: title.trim(),
        platform: platformMap[platformId] || platformId,
        content: contentItem.content,
        original_text: inputText,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.post('/content/save', saveData);

      toast({
        title: "Saved!",
        description: `${contentItem.platform} content saved successfully`,
      });
      setShowSaveModal(false);
      setSaveConfig({ platformId: '', title: '', tags: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.message || "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setSavingContentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Content Generator
          </h1>
          <p className="text-gray-600">Transform your content for multiple platforms</p>
        </div>

        {/* Input Text Area */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Content Input</span>
            </CardTitle>
            <CardDescription>
              {extractedText ? "Using extracted content" : "Enter your content to transform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="input-text">Source Text</Label>
              <div className="relative">
                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter or paste your content here..."
                  className="min-h-[150px] pr-10"
                />
                {inputText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => setInputText('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Select Platforms</CardTitle>
            <CardDescription>
              Choose the platforms you want to generate content for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                  onClick={() => togglePlatform(platform.id)}
                  className={cn("h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all",
                    selectedPlatforms.includes(platform.id) && "bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                  )}
                >
                  {platform.icon}
                  <span className="text-xs font-medium text-center">{platform.name}</span>
                  {selectedPlatforms.includes(platform.id) && (
                    <Check className="w-4 h-4 text-white absolute top-1 right-1" />
                  )}
                </Button>
              ))}
            </div>

            {/* Generate Button */}
            <div className="mt-6">
              <Button
                onClick={generateAllContent}
                disabled={isGenerating || !inputText.trim() || selectedPlatforms.length === 0}
                className="w-full h-12 text-lg bg-gradient-brand text-white hover:opacity-90 transition-opacity"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Content for {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isGenerating && (
          <Card className="shadow-lg">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Generating your content...</p>
                <p className="text-sm text-gray-400 mt-1">
                  Processing {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Content */}
        {generatedContent.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Generated Content</h3>
            <div className="grid gap-4">
              {generatedContent.map((item, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.platform}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(item.content, item.platform)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSaveContent(item.platformId, item.platform)}
                          disabled={savingContentId === item.platformId}
                        >
                          {savingContentId === item.platformId ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-1" />
                          )}
                          Save
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                        {item.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Save Content</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="save-title">Title</Label>
                  <Input
                    id="save-title"
                    value={saveConfig.title}
                    onChange={(e) => setSaveConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a title for this content"
                  />
                </div>
                
                <div>
                  <Label htmlFor="save-tags">Tags (comma-separated)</Label>
                  <Input
                    id="save-tags"
                    value={saveConfig.tags}
                    onChange={(e) => setSaveConfig(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="marketing, social media, campaign"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={confirmSaveContent} className="bg-gradient-brand text-white hover:opacity-90 transition-opacity">
                  Save Content
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;