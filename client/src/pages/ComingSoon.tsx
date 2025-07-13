import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Rocket, 
  Star, 
  Clock, 
  ArrowLeft, 
  Sparkles,
  Calendar,
  Bell
} from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--space-blue)/20)] via-[hsl(var(--space-purple)/10)] to-[hsl(var(--space-pink)/10)]">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--space-gold))] via-[hsl(var(--space-pink))] to-[hsl(var(--space-purple))] rounded-full blur opacity-20"></div>
              <div className="relative bg-[hsl(var(--space-purple)/20)] p-6 rounded-full">
                <Rocket className="h-12 w-12 text-[hsl(var(--space-gold))]" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[hsl(var(--space-gold))] via-[hsl(var(--space-pink))] to-[hsl(var(--space-purple))] bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-xl text-[hsl(var(--foreground)/80)] mb-8 max-w-2xl mx-auto">
            We're working on something amazing! This feature is currently under development and will be available soon.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="bg-[hsl(var(--space-purple)/20)] px-4 py-2 text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              In Development
            </Badge>
            <Badge variant="outline" className="bg-[hsl(var(--space-blue)/20)] px-4 py-2 text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              New Features
            </Badge>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-[hsl(var(--space-purple)/20)] bg-[hsl(var(--space-gray)/30)] hover:bg-[hsl(var(--space-gray)/40)] transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-gold)/20)] flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-[hsl(var(--space-gold))]" />
              </div>
              <CardTitle className="text-lg">Enhanced Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[hsl(var(--foreground)/70)] text-center">
                New functionality that will enhance your community experience
              </p>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--space-pink)/20)] bg-[hsl(var(--space-gray)/30)] hover:bg-[hsl(var(--space-gray)/40)] transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-pink)/20)] flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-[hsl(var(--space-pink))]" />
              </div>
              <CardTitle className="text-lg">Better Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[hsl(var(--foreground)/70)] text-center">
                Improved tools and workflows for more efficient collaboration
              </p>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--space-blue)/20)] bg-[hsl(var(--space-gray)/30)] hover:bg-[hsl(var(--space-gray)/40)] transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-blue)/20)] flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-[hsl(var(--space-blue))]" />
              </div>
              <CardTitle className="text-lg">Smart Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[hsl(var(--foreground)/70)] text-center">
                Stay updated with intelligent notifications and alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-[hsl(var(--space-purple)/10)] border-[hsl(var(--space-purple)/30)]">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Stay in the Loop</h2>
              <p className="text-[hsl(var(--foreground)/80)] mb-6">
                Want to be notified when this feature launches? Join our community and be the first to know!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[hsl(var(--space-gold))] to-[hsl(var(--space-pink))] border-none"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" size="lg">
                    <Bell className="mr-2 h-4 w-4" />
                    Get Notified
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-[hsl(var(--foreground)/60)]">
            Questions? Visit our{" "}
            <Link href="/browse" className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-gold))] transition-colors">
              community issues
            </Link>{" "}
            page or{" "}
            <Link href="/auth" className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-gold))] transition-colors">
              join our mission
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;