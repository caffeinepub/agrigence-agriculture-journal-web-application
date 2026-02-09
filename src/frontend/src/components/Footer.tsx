import { Link } from '@tanstack/react-router';
import { SiFacebook, SiInstagram, SiX, SiYoutube, SiLinkedin } from 'react-icons/si';
import { Heart } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/assets/generated/agrigence-logo-transparent.dim_200x200.png" 
                alt="Agrigence" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-primary">Agrigence</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Leading platform for agricultural research and journal publication
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61571913088088"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/agrigence/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/Agrigence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@Agrigence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiYoutube className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/agrigence/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/journals" className="text-muted-foreground hover:text-primary transition-colors">
                  Journals
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link to="/editorial-board" className="text-muted-foreground hover:text-primary transition-colors">
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link to="/author-guidelines" className="text-muted-foreground hover:text-primary transition-colors">
                  Author Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/subscription" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about-contact" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about-contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: admin@agrigence.com</li>
              <li>Phone: +91 9452571317</li>
              <li>
                Address: Zura Haradhan, Chandauli
                <br />
                Uttar Pradesh, 221115
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <CountdownTimer />
            </div>
            <div className="text-sm text-muted-foreground">
              <VisitorCounter />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
