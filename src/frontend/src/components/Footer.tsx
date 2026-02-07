import { SiFacebook, SiInstagram, SiX, SiYoutube, SiLinkedin } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import CountdownTimer from './CountdownTimer';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Submission Deadline</h3>
            <CountdownTimer />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Agrigence</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Agriculture Knowledge, Research & Opportunities in One Place
              </p>
              <Link
                to="/terms-and-conditions"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Terms and Conditions
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">Phone: +91 9452571317</p>
              <p className="text-sm text-muted-foreground mb-4">Email: agrigence@gmail.com</p>
              <h4 className="font-semibold text-sm mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/agrigence.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/agrigence.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://x.com/agrigence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@agrigence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <SiYoutube className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/agrigence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            caffeine.ai
          </a>
        </div>
      </div>
      <VisitorCounter />
    </footer>
  );
}
