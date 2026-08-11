import { Link } from "wouter";

/**
 * A compact footer component for pages with tabs or limited vertical space
 */
const CompactFooter = () => {
  return (
    <footer className="bg-[hsl(var(--space-blue))] py-3 px-4 border-t border-[hsl(var(--space-purple)/20)]">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <div className="w-6 h-6 bg-[hsl(var(--space-purple))] rounded-full flex items-center justify-center">
              <i className="ri-planet-line text-sm"></i>
            </div>
            <p className="text-sm text-[hsl(var(--foreground)/60)]">
              &copy; {new Date().getFullYear()} OFFSHOT
            </p>
          </div>
          
          <div className="flex flex-wrap space-x-4 justify-center">
            <Link href="/privacy" className="text-[hsl(var(--foreground)/60)] text-xs hover:text-[hsl(var(--space-pink))] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[hsl(var(--foreground)/60)] text-xs hover:text-[hsl(var(--space-pink))] transition-colors">
              Terms
            </Link>
            <Link href="/mission" className="text-[hsl(var(--foreground)/60)] text-xs hover:text-[hsl(var(--space-pink))] transition-colors">
              About Us
            </Link>
            <a href="#" className="text-[hsl(var(--foreground)/60)] text-xs hover:text-[hsl(var(--space-pink))] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CompactFooter;