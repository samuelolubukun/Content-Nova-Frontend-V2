import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { Upload, Youtube, FileText, Loader2, CheckCircle } from 'lucide-react';

interface ContentExtractorProps {
  onTextExtracted: (text: string) => void;
}

const ContentExtractor: React.FC<ContentExtractorProps> = ({ onTextExtracted }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const { toast } = useToast();

  // File type mapping to endpoints
  const getEndpointForFileType = (fileType: string): string => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': '/extract/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '/extract/docx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '/extract/pptx',
      'image/jpeg': '/extract/image',
      'image/png': '/extract/image',
      'audio/mpeg': '/extract/audio',
      'video/mp4': '/extract/video'
    };
    return typeMap[fileType] || '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'audio/mpeg',
        'video/mp4'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please select a valid file type (PDF, DOCX, PPTX, JPG, PNG, MP3, MP4)",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setExtractionComplete(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    const endpoint = getEndpointForFileType(selectedFile.type);
    if (!endpoint) {
      toast({
        title: "Error",
        description: "Unsupported file type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    let fileToSend = selectedFile;

    // PNG to JPG Conversion Logic
    if (selectedFile.type === 'image/png') {
      try {
        fileToSend = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            // Background for transparency
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                resolve(new File([blob], selectedFile.name.replace(/\.png$/, '.jpg'), { type: 'image/jpeg' }));
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            }, 'image/jpeg', 0.9); // 0.9 is the quality
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(selectedFile);
        });

        toast({
          title: "Conversion",
          description: "PNG image converted to JPG for upload.",
        });
      } catch (error) {
        console.error('Image conversion error:', error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to convert PNG to JPG.",
          variant: "destructive",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append('file', fileToSend);

    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const extractedContent = response.data.text || response.data.extracted_text || response.data.content || response.data.transcript || response.data;

      if (extractedContent) {
        setExtractedText(extractedContent);
        onTextExtracted(extractedContent);
        setExtractionComplete(true);
        toast({
          title: "Success",
          description: "Text extracted successfully!",
        });
      } else {
        throw new Error("No text content found in response");
      }
    } catch (error: any) {
      console.error('File extraction error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to extract text from file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleYoutubeExtract = async () => {
    if (!youtubeUrl) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/youtube/extract', {
        youtube_url: youtubeUrl,
      });

      const extractedContent = response.data.text || response.data.transcript || response.data.content || response.data.extracted_text || response.data;

      if (extractedContent) {
        setExtractedText(extractedContent);
        onTextExtracted(extractedContent);
        setExtractionComplete(true);
        toast({
          title: "Success",
          description: "YouTube transcript extracted successfully!",
        });
      } else {
        throw new Error("No transcript content found in response");
      }
    } catch (error: any) {
      console.error('YouTube extraction error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to extract YouTube transcript",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearExtractedText = () => {
    setExtractedText('');
    setExtractionComplete(false);
    setSelectedFile(null);
    setYoutubeUrl('');
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Content Extractor
          </h1>
          <p className="text-gray-600">Extract content to repurpose</p>
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload File</span>
                </CardTitle>
                <CardDescription>
                  Upload PDF, DOCX, PPTX, JPG, or MP3 files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Choose File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.mp3,.mp4"
                    className="cursor-pointer"
                  />
                </div>
                {selectedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                    </p>
                  </div>
                )}
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Extract Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* YouTube URL Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <span>YouTube Video</span>
                </CardTitle>
                <CardDescription>
                  Extract transcript from YouTube videos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleYoutubeExtract}
                  disabled={!youtubeUrl || isLoading}
                  className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      Extract Transcript
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Extracted Text Display */}
          {extractedText && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {extractionComplete && <CheckCircle className="w-5 h-5 text-green-600" />}
                    <span>Extracted Text</span>
                  </div>
                  <Button
                    onClick={clearExtractedText}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </CardTitle>
                <CardDescription>
                  Review the extracted content below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={extractedText}
                  readOnly
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {extractedText.length} characters extracted
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentExtractor;