import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { 
  Loader2, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  FileText,
  Calendar,
  Tag,
  ArrowLeft,
  X,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  BookOpen,
  Mail
} from 'lucide-react';

interface SavedContent {
  id: number;
  title: string;
  content: string;
  platform: string;
  created_at: string;
  updated_at?: string;
  tags?: string[];
}

interface Stats {
  total_contents: number;
  platform_breakdown: { [key: string]: number };
}

const SavedContentManager = () => {
  const [contents, setContents] = useState<SavedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContents, setTotalContents] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedContent, setSelectedContent] = useState<SavedContent | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState<SavedContent | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { toast } = useToast();

  const platformLabels: { [key: string]: string } = {
    'youtube_script': 'Video Script',
    'instagram_caption': 'Instagram',
    'linkedin_post': 'LinkedIn',
    'tweet': 'Twitter/X',
    'blog_post': 'Blog Post',
    'article': 'Article',
    'newsletter': 'Newsletter'
  };

  const platformIcons: { [key: string]: React.ReactNode } = {
    'youtube_script': <Youtube className="h-5 w-5 text-red-600" />,
    'instagram_caption': <Instagram className="h-5 w-5 text-pink-600" />,
    'linkedin_post': <Linkedin className="h-5 w-5 text-blue-600" />,
    'tweet': <Twitter className="h-5 w-5 text-blue-400" />,
    'blog_post': <BookOpen className="h-5 w-5 text-green-600" />,
    'article': <FileText className="h-5 w-5 text-gray-600" />,
    'newsletter': <Mail className="h-5 w-5 text-purple-600" />
  };

  useEffect(() => {
    fetchContents();
    fetchStats();
  }, [currentPage, selectedPlatform]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '10'
      });

      if (selectedPlatform) {
        params.append('platform', selectedPlatform);
      }

      const response = await api.get(`/content?${params}`);
      
      // Handle different response structures
      if (response.data.contents) {
        // Paginated response
        setContents(response.data.contents);
        setTotalPages(Math.ceil(response.data.total / response.data.per_page));
        setTotalContents(response.data.total);
      } else if (Array.isArray(response.data)) {
        // Simple array response
        setContents(response.data);
        setTotalContents(response.data.length);
        setTotalPages(1);
      } else {
        setContents([]);
        setTotalContents(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Fetch contents error:', error);
      setError(error.response?.data?.detail || 'Failed to fetch contents');
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/content/stats');
      setStats(response.data);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
      // Don't show error for stats, it's not critical
    }
  };

  const handleEdit = (content: SavedContent) => {
    setEditingContent(content);
    setEditForm({
      title: content.title,
      content: content.content,
      tags: content.tags ? content.tags.join(', ') : ''
    });
    setShowEditModal(true);
  };

  const handleUpdateContent = async () => {
    if (!editingContent) return;
    
    try {
      const updateData = {
        title: editForm.title,
        content: editForm.content,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.put(`/content/${editingContent.id}`, updateData);
      
      setContents(contents.map(content =>
        content.id === editingContent.id ? response.data : content
      ));
      setShowEditModal(false);
      setEditingContent(null);
      toast({
        title: "Success",
        description: "Content updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update content",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (contentId: number) => {
    setIsDeleting(contentId);
    try {
      await api.delete(`/content/${contentId}`);
      setContents(contents.filter(content => content.id !== contentId));
      setDeleteConfirm(null);
      
      // If viewing deleted content, go back to list
      if (selectedContent?.id === contentId) {
        setSelectedContent(null);
      }
      
      toast({
        title: "Success",
        description: "Content deleted successfully!",
      });
      fetchStats(); // Refresh stats
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete content",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = async (text: string, title?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: title ? `"${title}" copied to clipboard` : "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'youtube_script': 'bg-red-100 text-red-800',
      'instagram_caption': 'bg-pink-100 text-pink-800',
      'linkedin_post': 'bg-blue-100 text-blue-800',
      'tweet': 'bg-sky-100 text-sky-800',
      'blog_post': 'bg-green-100 text-green-800',
      'article': 'bg-gray-100 text-gray-800',
      'newsletter': 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading saved content...</p>
        </div>
      </div>
    );
  }

  // Detail view for selected content
  if (selectedContent) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedContent(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </Button>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {platformIcons[selectedContent.platform] || <FileText className="w-6 h-6" />}
                <div>
                  <h1 className="text-xl font-bold">{selectedContent.title}</h1>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(selectedContent.platform)}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {platformLabels[selectedContent.platform] || selectedContent.platform}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(selectedContent.created_at)}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 border rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800 leading-relaxed">
                {selectedContent.content}
              </pre>
            </div>
            
            {selectedContent.tags && selectedContent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedContent.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(selectedContent.content, selectedContent.title)}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Content</span>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirm(selectedContent.id)}
                disabled={isDeleting === selectedContent.id}
                className="flex items-center space-x-2"
              >
                {isDeleting === selectedContent.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main list view
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Header with Stats */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Saved Content</CardTitle>
            <CardDescription>
              Manage and organize all your generated content ({totalContents} items)
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total_contents}</div>
              <div className="text-sm text-gray-600">Total Content</div>
            </Card>
            {Object.entries(stats.platform_breakdown).map(([platform, count]) => (
              <Card key={platform} className="text-center p-4">
                <div className="flex justify-center mb-2">
                  {platformIcons[platform] || <FileText className="w-5 h-5" />}
                </div>
                <div className="text-xl font-bold">{count}</div>
                <div className="text-xs text-gray-600">{platformLabels[platform] || platform}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="platform-filter" className="text-sm font-medium">Filter by Platform:</label>
              <select
                id="platform-filter"
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="">All Platforms</option>
                {Object.entries(platformLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {contents.length} of {totalContents} content items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      {contents.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-3">No Content Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedPlatform
                ? `No content found for ${platformLabels[selectedPlatform]}`
                : "You haven't saved any content yet. Generate some content to get started!"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {contents.map((content) => (
            <Card key={content.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-3">
                      {platformIcons[content.platform] || <FileText className="w-5 h-5" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(content.platform)}`}>
                        {platformLabels[content.platform] || content.platform}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 truncate">{content.title}</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {truncateText(content.content, 200)}
                      </p>
                    </div>
                    
                    {content.tags && content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {content.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created: {formatDate(content.created_at)}
                      </span>
                      {content.updated_at && content.updated_at !== content.created_at && (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Updated: {formatDate(content.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContent(content)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(content.content, content.title)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(content)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirm(content.id)}
                      disabled={isDeleting === content.id}
                    >
                      {isDeleting === content.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                Edit {platformLabels[editingContent.platform]}
              </h3>
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="marketing, social media, campaign"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateContent}>
                Update Content
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this content? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedContentManager;