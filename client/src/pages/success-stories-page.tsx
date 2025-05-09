import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  TrendingUp, 
  Shield, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Star,
  Award,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

const SuccessStoriesPage = () => {
  // Sample success stories data
  const featuredStories = [
    {
      id: 1,
      title: "Community-driven solution to environmental monitoring",
      category: "Environment",
      description: "Our community helped build a network of sensors that monitor air quality across urban areas, empowering citizens with real-time data.",
      impact: "15 cities now have community-maintained air quality monitoring networks",
      user: {
        name: "Sarah Johnson",
        role: "Environmental Scientist",
        avatar: ""
      },
      outcome: "Created policy change in 3 major cities",
      votes: 342,
      comments: 89
    },
    {
      id: 2,
      title: "Open data initiative improved local transportation",
      category: "Urban Planning",
      description: "By collaborating with transportation authorities to release data, our community built applications that optimized public transit routes.",
      impact: "Reduced average commute times by 23% for over 200,000 daily riders",
      user: {
        name: "Marcus Chen",
        role: "Data Scientist",
        avatar: ""
      },
      outcome: "Implemented in 7 cities nationwide",
      votes: 287,
      comments: 56
    },
    {
      id: 3,
      title: "Accessible education platform for rural areas",
      category: "Education",
      description: "Our members developed a low-bandwidth educational platform that works even in areas with limited internet connectivity.",
      impact: "Now reaching over 50,000 students in remote communities",
      user: {
        name: "Priya Patel",
        role: "Education Advocate",
        avatar: ""
      },
      outcome: "Adopted by 120+ schools in underserved regions",
      votes: 418,
      comments: 104
    }
  ];

  const communityStories = [
    {
      id: 4,
      title: "Community garden tracking application",
      category: "Agriculture",
      description: "A group of developers created an application to help community gardens track planting, harvests, and volunteer hours.",
      impact: "Supporting over 200 community gardens nationwide",
      user: {
        name: "James Wilson",
        role: "Urban Farmer",
        avatar: ""
      }
    },
    {
      id: 5,
      title: "Volunteer matching service for disaster relief",
      category: "Crisis Response",
      description: "When natural disasters strike, this platform helps match skilled volunteers with areas in need of specific assistance.",
      impact: "Deployed in 12 major disaster responses in the past year",
      user: {
        name: "Elena Rodriguez",
        role: "Emergency Response Coordinator",
        avatar: ""
      }
    },
    {
      id: 6,
      title: "Mental health support network",
      category: "Healthcare",
      description: "A peer support network that connects people struggling with mental health challenges to trained community volunteers.",
      impact: "Over 15,000 support sessions facilitated in the past year",
      user: {
        name: "Thomas Lee",
        role: "Mental Health Advocate",
        avatar: ""
      }
    }
  ];

  // Success metrics
  const impactMetrics = [
    { metric: "Communities Impacted", value: "500+", icon: <Users className="h-6 w-6 text-blue-500" /> },
    { metric: "Active Projects", value: "230", icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
    { metric: "Success Rate", value: "78%", icon: <CheckCircle2 className="h-6 w-6 text-purple-500" /> },
    { metric: "Volunteer Hours", value: "120K+", icon: <Shield className="h-6 w-6 text-orange-500" /> }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--space-pink))] to-[hsl(var(--space-purple))] bg-clip-text text-transparent">
          Success Stories
        </h1>
        <p className="text-xl text-[hsl(var(--foreground)/80)] max-w-3xl mx-auto mb-8">
          Celebrating the incredible achievements of our community members who are using technology to make a real difference.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {impactMetrics.map((item, index) => (
            <div 
              key={index} 
              className="bg-[hsl(var(--card)/60)] border-[hsl(var(--space-purple)/30)] border rounded-lg p-6 flex flex-col items-center justify-center"
            >
              <div className="mb-3">
                {item.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--foreground))]">{item.value}</h3>
              <p className="text-[hsl(var(--foreground)/70)]">{item.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Success Stories */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center">
            <Star className="h-6 w-6 mr-2 text-[hsl(var(--space-gold))]" />
            Featured Success Stories
          </h2>
          <Button variant="outline" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStories.map((story) => (
            <Card key={story.id} className="hover:shadow-md transition-all border-[hsl(var(--space-purple)/30)]">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-[hsl(var(--space-purple)/10)] mb-2">
                    {story.category}
                  </Badge>
                  <Award className="text-[hsl(var(--space-gold))] h-5 w-5" />
                </div>
                <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                <CardDescription>{story.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={story.user.avatar} />
                    <AvatarFallback className="bg-[hsl(var(--space-blue)/20)]">
                      {story.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{story.user.name}</p>
                    <p className="text-xs text-[hsl(var(--foreground)/70)]">{story.user.role}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-[hsl(var(--space-purple)/5)] p-3 mb-4">
                  <div className="text-sm font-medium flex items-start">
                    <Zap className="h-4 w-4 mr-2 text-[hsl(var(--space-gold))] shrink-0 mt-0.5" />
                    <span>{story.impact}</span>
                  </div>
                </div>
                <div className="text-sm text-[hsl(var(--foreground)/70)] flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>{story.outcome}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-[hsl(var(--foreground)/70)]">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{story.votes} votes</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{story.comments} comments</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Story Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="all">All Stories</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityStories.map((story) => (
              <Card key={story.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{story.category}</Badge>
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(var(--foreground)/70)] mb-4">{story.description}</p>
                  <div className="flex items-center text-sm">
                    <Zap className="h-4 w-4 mr-2 text-[hsl(var(--space-gold))]" />
                    <p className="font-medium">{story.impact}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="text-xs">
                        {story.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{story.user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="environment">
            <div className="text-center py-8">
              <p className="text-[hsl(var(--foreground)/70)]">
                Showing environmental success stories. You can filter to see specific categories.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="education">
            <div className="text-center py-8">
              <p className="text-[hsl(var(--foreground)/70)]">
                Showing education success stories. You can filter to see specific categories.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="healthcare">
            <div className="text-center py-8">
              <p className="text-[hsl(var(--foreground)/70)]">
                Showing healthcare success stories. You can filter to see specific categories.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-[hsl(var(--space-purple)/10)] rounded-xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Share Your Success Story</h2>
        <p className="text-[hsl(var(--foreground)/80)] max-w-3xl mx-auto mb-8">
          Have you used our platform to create positive change in your community? 
          We'd love to hear about it and potentially feature your story.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-[hsl(var(--space-purple))] hover:bg-[hsl(var(--space-purple)/90)]">
            Submit Your Story
          </Button>
          <Button variant="outline">
            Learn Submission Guidelines
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesPage;