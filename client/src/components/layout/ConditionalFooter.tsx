import { useLocation } from "wouter";
import Footer from "./Footer";
import CompactFooter from "./CompactFooter";

// Pages that should use the compact footer
const COMPACT_FOOTER_PAGES = [
  "/chat",  // Chat page with tabs
  "/games", // Games page potentially with interactive content
  "/analytics" // Analytics page with data visualization
];

/**
 * A conditional footer that switches between full and compact versions
 * based on the current page or an override prop
 */
type ConditionalFooterProps = {
  forceCompact?: boolean;
  forceRegular?: boolean;
};

const ConditionalFooter = ({ 
  forceCompact = false, 
  forceRegular = false 
}: ConditionalFooterProps) => {
  const [location] = useLocation();
  
  // Determine if we should use the compact footer
  const shouldUseCompact = () => {
    // Props take precedence
    if (forceCompact) return true;
    if (forceRegular) return false;
    
    // Check if current page is in our compact footer list
    return COMPACT_FOOTER_PAGES.includes(location);
  };
  
  // Render the appropriate footer
  return shouldUseCompact() ? <CompactFooter /> : <Footer />;
};

export default ConditionalFooter;