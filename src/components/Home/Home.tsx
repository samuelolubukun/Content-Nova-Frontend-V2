import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Youtube,
  Share2,
  BookOpen,
  ArrowRight,
  Play,
  Download,
  Zap,
  Sparkles,
  RefreshCcw,
  LayoutGrid,
  Heart,
  Lightbulb,
} from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const Home = () => {

  const scrollToVideo = () => {
    const videoSection = document.getElementById('video-demo');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-brand py-20 md:py-32 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Transform Your Content</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300">Effortlessly</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Extract text from any source and generate engaging content for every platform. From PDFs to YouTube videos, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="secondary"
                size="xl"
                asChild
                className="glow hover:scale-105 transition-all duration-200"
              >
                <Link to="/register">
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={scrollToVideo}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Content Repurposing <span className="text-gradient-brand">Command Center</span> 🚀
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extract, transform, and share your content like never before. Get started with our powerful, intuitive tool built for creators like you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-brand text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Content Extractor</h3>
                <p className="text-muted-foreground mb-6">
                  Extract and centralize content from any source, from long-form articles to videos.
                </p>
                <div className="flex justify-center space-x-2 opacity-60">
                  <Youtube className="w-6 h-6 text-red-500" />
                  <FileText className="w-6 h-6 text-gray-700" />
                  <LayoutGrid className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-brand text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <RefreshCcw className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI-Powered Repurposer</h3>
                <p className="text-muted-foreground mb-6">
                  Transform your extracted content into engaging posts optimized for every platform.
                </p>
                <div className="flex justify-center space-x-2 opacity-60">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <Share2 className="w-6 h-6 text-blue-500" />
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-brand text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Content Manager</h3>
                <p className="text-muted-foreground mb-6">
                  Organize, save, and manage all your generated content in one seamless library.
                </p>
                <div className="flex justify-center space-x-2 opacity-60">
                  <BookOpen className="w-6 h-6 text-green-500" />
                  <Heart className="w-6 h-6 text-red-500" />
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* Teaser Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        <span className="bg-clip-text text-transparent bg-gradient-brand">The Story Continues...</span> ✨
      </h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        We're committed to helping you do more than just repurpose content. What you see today is just the beginning. The future of content creation is on the horizon, and you're at the forefront.
      </p>
    </div>
  </div>
</section>

      {/* Video Demo Section */}
      <section className="py-20 bg-gray-50" id="video-demo">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              See Content Nova in Action
            </h2>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video
                className="w-full aspect-video"
                controls
                poster="/placeholder.svg"
              >
                <source src="/contentnova.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-8">
              <Button variant="hero" size="xl" asChild className="bg-gradient-brand text-white">
                <Link to="/register">
                  Start Creating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Content Creation?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join content creators who are already saving time and creating better content with Content Nova.
            </p>
            <Button variant="hero" size="xl" asChild className="bg-gradient-brand text-white shadow-2xl">
              <Link to="/register">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;