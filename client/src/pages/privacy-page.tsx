import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[hsl(var(--foreground)/70)]">
            Last updated: April 8, 2025
          </p>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            At OFFSHOT, we respect your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our platform, including:
          </p>
          <ul>
            <li><strong>Personal Information:</strong> When you create an account or submit content, we collect information such as your name, email address, username, and profile information.</li>
            <li><strong>Content Information:</strong> Information you provide when submitting issues, including titles, descriptions, locations, and categories.</li>
            <li><strong>Usage Information:</strong> Information about how you use our platform, including browsing patterns, pages visited, and features used.</li>
            <li><strong>Device Information:</strong> Information about the devices you use to access our platform, including IP address, browser type, and operating system.</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our platform</li>
            <li>Process and display the content you submit</li>
            <li>Communicate with you about your account, inquiries, and our services</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Protect the security and integrity of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2>3. Sharing Your Information</h2>
          <p>
            We may share your information in the following circumstances:
          </p>
          <ul>
            <li><strong>Public Content:</strong> Issues, comments, and other content you post on our platform will be visible to other users.</li>
            <li><strong>Service Providers:</strong> We may share information with third-party vendors who assist us in operating our platform, conducting our business, or serving our users.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, 
            disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure, 
            and we cannot guarantee absolute security.
          </p>
          
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>Accessing, correcting, or deleting your personal information</li>
            <li>Restricting or objecting to our processing of your personal information</li>
            <li>Data portability</li>
            <li>Withdrawing consent at any time</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
          
          <h2>6. Children's Privacy</h2>
          <p>
            Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
          
          <h2>7. Changes to Our Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2>8. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We have no control over and assume no responsibility for the content, 
            privacy policies, or practices of any third-party sites or services.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@reallyobviousmedialab.com.
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

export default PrivacyPage;