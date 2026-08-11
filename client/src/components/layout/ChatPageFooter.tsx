import { Link } from "wouter";

/**
 * A minimal in-page footer for the chat page
 */
const ChatPageFooter = () => {
  return (
    <div className="mt-4 border-t pt-3 text-center text-xs text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} OFFSHOT. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-1">
        <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        <Link href="/terms" className="hover:text-primary">Terms</Link>
        <Link href="/mission" className="hover:text-primary">About</Link>
      </div>
    </div>
  );
};

export default ChatPageFooter;