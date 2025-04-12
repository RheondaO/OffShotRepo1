import { useLocation } from "wouter";
import Footer from "./Footer";
import CompactFooter from "./CompactFooter";

// Pages that should use the compact footer
const COMPACT_FOOTER_PAGES = [
  "/games", // Games page potentially with interactive content
  "/analytics" // Analytics page with data visualization
];

// Pages that should have no main footer (using in-page footers instead)
const NO_FOOTER_PAGES = [
  "/chat"  // Chat page has its own in-page footer
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
  
  // Check if we should hide the footer entirely
  const shouldHideFooter = () => {
    return NO_FOOTER_PAGES.includes(location);
  };
  
  // Determine if we should use the compact footer
  const shouldUseCompact = () => {
    // Props take precedence
    if (forceCompact) return true;
    if (forceRegular) return false;
    
    // Check if current page is in our compact footer list
    return COMPACT_FOOTER_PAGES.includes(location);
  };
  
  // First check if we should hide the footer
  if (shouldHideFooter()) {
    return null;
  }
  
  // Otherwise render the appropriate footer
  return shouldUseCompact() ? <CompactFooter /> : <Footer />;
};

export default ConditionalFooter;