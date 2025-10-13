import { Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t gradient-brand">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Content Nova. All rights reserved.
          </div>
          <a 
            href="https://www.instagram.com/contentnova.ai/#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-4 w-4" />
            <span>Follow Us</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;