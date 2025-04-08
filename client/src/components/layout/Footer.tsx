import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--space-blue))] py-12 px-4 border-t border-[hsl(var(--space-purple)/20)]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[hsl(var(--space-purple))] rounded-full flex items-center justify-center">
                <i className="ri-planet-line text-lg"></i>
              </div>
              <h2 className="text-xl font-bold">Really Obvious Media Lab</h2>
            </div>
            <p className="text-[hsl(var(--foreground)/70)] mb-6">
              Connecting communities to solve local issues together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors" aria-label="Twitter">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors" aria-label="Instagram">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors" aria-label="Facebook">
                <i className="ri-facebook-circle-line text-xl"></i>
              </a>
              <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors" aria-label="LinkedIn">
                <i className="ri-linkedin-box-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Browse Issues
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/submit" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Submit Issue
                </Link>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Volunteer
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[hsl(var(--space-purple)/20)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[hsl(var(--foreground)/60)] text-sm">
            &copy; {new Date().getFullYear()} Really Obvious Media Lab. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-[hsl(var(--foreground)/60)] text-sm hover:text-[hsl(var(--space-pink))] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[hsl(var(--foreground)/60)] text-sm hover:text-[hsl(var(--space-pink))] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[hsl(var(--foreground)/60)] text-sm hover:text-[hsl(var(--space-pink))] transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
