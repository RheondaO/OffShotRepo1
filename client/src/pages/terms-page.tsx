import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const TermsPage = () => {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[hsl(var(--foreground)/70)]">
            Last updated: April 8, 2025
          </p>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            These Terms of Service ("Terms") govern your access to and use of the OFFSHOT platform
            ("we," "us," or "our"). By accessing or using our platform, you agree to be bound by these Terms.
          </p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, submitting content, or otherwise accessing our platform, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our platform.
          </p>
          
          <h2>2. Community Guidelines</h2>
          <p>
            Our platform aims to foster constructive dialogue about community issues. When using our platform:
          </p>
          <ul>
            <li>Be respectful and constructive in your communications</li>
            <li>Do not post content that is abusive, threatening, defamatory, or discriminatory</li>
            <li>Do not post misleading or false information</li>
            <li>Do not use our platform for illegal activities or to promote harmful behaviors</li>
            <li>Respect the privacy and intellectual property rights of others</li>
          </ul>
          
          <h2>3. User Accounts</h2>
          <p>
            To access certain features, you must create an account. You are responsible for:
          </p>
          <ul>
            <li>Providing accurate information when registering</li>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
          
          <h2>4. User Content</h2>
          <p>
            By submitting content to our platform, you:
          </p>
          <ul>
            <li>Retain ownership of your content</li>
            <li>Grant us a worldwide, non-exclusive, royalty-free license to use, store, display, and distribute your content on our platform</li>
            <li>Represent that you have all necessary rights to submit this content</li>
            <li>Understand that we may remove content that violates these Terms</li>
          </ul>
          
          <h2>5. Privacy</h2>
          <p>
            Our <Link href="/privacy" className="text-[hsl(var(--space-pink))] hover:underline">Privacy Policy</Link> describes 
            how we collect, use, and share information about you when you use our platform. By using our platform, you consent 
            to the collection and use of information as described in our Privacy Policy.
          </p>
          
          <h2>6. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms 
            on our platform. Your continued use of our platform after such changes constitutes your acceptance of the revised Terms.
          </p>
          
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            Our platform is provided "as is" without warranties of any kind, either express or implied. We do not guarantee 
            that our platform will be uninterrupted, secure, or error-free.
          </p>
          
          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of or inability to use our platform.
          </p>
          
          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, 
            without regard to its conflict of law provisions.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@reallyobviousmedialab.com.
          </p>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;