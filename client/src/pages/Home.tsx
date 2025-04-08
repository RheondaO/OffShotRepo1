import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Trophy, 
  Star,
  BadgeCheck,
  Clock,
  TrendingUp,
  UserPlus,
  Gamepad2,
  Sparkles,
  Rocket
} from "lucide-react";
import IssueCard from "@/components/issues/IssueCard";
import { IssueCardSkeleton } from "@/components/issues/IssueCardSkeleton";
import CategoryCard from "@/components/issues/CategoryCard";
import { CategoryCardSkeleton } from "@/components/issues/CategoryCardSkeleton";
import IssueTable from "@/components/issues/IssueTable";
import { IssueTableSkeleton } from "@/components/issues/IssueTableSkeleton";
import { FeaturedIssuesSkeleton } from "@/components/issues/FeaturedIssuesSkeleton";
import SearchBar from "@/components/ui/search";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  type Category, 
  type Issue, 
  type XpActivity, 
  type Nft 
} from "@shared/schema";

const Home = () => {
  const [_, navigate] = useLocation();
  
  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch featured issues
  const { data: featuredIssues, isLoading: isFeaturedLoading } = useQuery<Issue[]>({
    queryKey: ['/api/issues/featured'],
  });
  
  // Fetch trending issues
  const { data: trendingIssues, isLoading: isTrendingLoading } = useQuery<Issue[]>({
    queryKey: ['/api/issues/trending'],
  });
  
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 px-4 md:py-24 md:px-6 relative bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[hsl(var(--space-blue)/70)] backdrop-blur-sm"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-[hsl(var(--space-gold))] via-[hsl(var(--space-pink))] to-[hsl(var(--space-purple))] bg-clip-text text-transparent">
                Discover, Shape & Level Up
              </span>
              <span className="block">Your Community Adventure</span>
            </h2>
            <p className="text-[hsl(var(--foreground)/80)] text-lg md:text-xl mb-8 leading-relaxed">
              Join the cosmic mission to improve your community. Complete challenges, earn XP, unlock NFT collectibles, and climb the leaderboard as you solve real-world issues together.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <Badge variant="outline" className="bg-[hsl(var(--space-purple)/20)] px-3 py-2 text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[hsl(var(--space-gold))]" />
                Earn XP & Level Up
              </Badge>
              <Badge variant="outline" className="bg-[hsl(var(--space-purple)/20)] px-3 py-2 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                Collect Unique NFTs
              </Badge>
              <Badge variant="outline" className="bg-[hsl(var(--space-purple)/20)] px-3 py-2 text-sm flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-[hsl(var(--space-blue))]" />
                Play Mini-Games
              </Badge>
            </div>
            
            <SearchBar className="max-w-2xl mx-auto mb-8" />
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {isCategoriesLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <Button key={i} variant="category" disabled>Loading...</Button>
                ))
              ) : (
                categories?.slice(0, 5).map((category) => (
                  <Link key={category.id} href={`/browse?categoryId=${category.id}`}>
                    <Button variant="category" className="cursor-pointer">
                      {category.name}
                    </Button>
                  </Link>
                ))
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/browse')}
                className="bg-gradient-to-r from-[hsl(var(--space-gold))] to-[hsl(var(--space-pink))] border-none"
              >
                Start Your Adventure
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/auth')}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Join the Mission
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Issues Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="inline-block mr-2">
                <i className="ri-star-line text-[hsl(var(--space-gold))]"></i>
              </span>
              Featured Community Issues
            </h2>
            <Link href="/browse" className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-gold))] flex items-center gap-1 transition-colors">
              View all
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isFeaturedLoading ? (
              Array(3).fill(0).map((_, i) => (
                <IssueCardSkeleton key={i} />
              ))
            ) : featuredIssues && featuredIssues.length > 0 ? (
              featuredIssues.slice(0, 3).map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-[hsl(var(--foreground)/60)]">
                No featured issues yet. Be the first to submit an issue!
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 px-4 bg-[hsl(var(--space-blue)/50)]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Explore Issues by Category
            </h2>
            <p className="text-[hsl(var(--foreground)/70)] max-w-2xl mx-auto">
              Find and contribute to the topics that matter most to you and your community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isCategoriesLoading ? (
              Array(8).fill(0).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            ) : (
              categories?.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  issueCount={Math.floor(Math.random() * 100)} // This will be replaced with actual counts
                  animationDelay={`${index * 0.2}s`}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Trending Issues Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="inline-block mr-2">
                <i className="ri-fire-line text-[hsl(var(--space-gold))]"></i>
              </span>
              Trending This Week
            </h2>
            <Link href="/browse" className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-gold))] flex items-center gap-1 transition-colors">
              View all
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          
          {isTrendingLoading ? (
            <IssueTableSkeleton />
          ) : trendingIssues && trendingIssues.length > 0 ? (
            <IssueTable issues={trendingIssues} />
          ) : (
            <div className="text-center py-12 text-[hsl(var(--foreground)/60)]">
              No trending issues yet. Be the first to submit an issue!
            </div>
          )}
        </div>
      </section>
      
      {/* Gamification Features Section */}
      <section className="py-20 px-4 bg-[hsl(var(--space-purple)/10)]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="inline-block mr-2">
                <Trophy className="h-7 w-7 inline-block text-[hsl(var(--space-gold))]" />
              </span>
              Join Our Cosmic Mission
            </h2>
            <p className="text-[hsl(var(--foreground)/70)] max-w-2xl mx-auto">
              Solve real community issues while earning rewards and having fun on your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* XP & Levels Card */}
            <Card className="border-[hsl(var(--space-gold))] border-opacity-30 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--space-gold))/5] to-transparent z-0"></div>
              <CardHeader className="relative z-10">
                <div className="p-2 rounded-full bg-[hsl(var(--space-gold))/10] w-fit mb-3">
                  <Star className="h-6 w-6 text-[hsl(var(--space-gold))]" />
                </div>
                <CardTitle>XP & Levels</CardTitle>
                <CardDescription>Earn experience points with every contribution</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Level Progress</span>
                    <span className="font-medium">102/150 XP</span>
                  </div>
                  <Progress value={68} className="h-2 bg-[hsl(var(--space-purple))/20]" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">8 Ways to Earn XP:</p>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Comment on Issues (1 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Reply to Comments (2 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Submit New Issues (5 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Vote on Issues (1 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Add Tags (5 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Share Issues (1 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Play Mini-Games (1 XP)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-[hsl(var(--space-pink))]" />
                      <span>Newsletter Signup (25 XP)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="relative z-10">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">Start Earning XP</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* NFT Collectibles Card */}
            <Card className="border-[hsl(var(--space-pink))] border-opacity-30 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--space-pink))/5] to-transparent z-0"></div>
              <CardHeader className="relative z-10">
                <div className="p-2 rounded-full bg-[hsl(var(--space-pink))/10] w-fit mb-3">
                  <Sparkles className="h-6 w-6 text-[hsl(var(--space-pink))]" />
                </div>
                <CardTitle>NFT Collectibles</CardTitle>
                <CardDescription>Unlock rare digital collectibles with your XP</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded-lg bg-[hsl(var(--space-purple))/20] flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--space-gold))/40] to-[hsl(var(--space-pink))/20] rounded-lg opacity-70"></div>
                    <Badge className="absolute top-1 right-1 bg-[hsl(var(--space-blue))] text-xs px-1.5 py-0">100 XP</Badge>
                    <Star className="h-8 w-8 text-white relative z-10" />
                  </div>
                  <div className="aspect-square rounded-lg bg-[hsl(var(--space-purple))/20] flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--space-pink))/40] to-[hsl(var(--space-purple))/20] rounded-lg opacity-70"></div>
                    <Badge className="absolute top-1 right-1 bg-[hsl(var(--space-pink))] text-xs px-1.5 py-0">500 XP</Badge>
                    <Rocket className="h-8 w-8 text-white relative z-10" />
                  </div>
                  <div className="aspect-square rounded-lg bg-[hsl(var(--space-purple))/20] flex items-center justify-center relative">
                    <AlertCircle className="h-8 w-8 text-[hsl(var(--foreground))/20]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-medium text-[hsl(var(--foreground))/60]">Locked</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">5 Collectible Categories:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline" className="justify-center">Cosmic Pioneer</Badge>
                    <Badge variant="outline" className="justify-center">Community Hero</Badge>
                    <Badge variant="outline" className="justify-center">Issue Solver</Badge>
                    <Badge variant="outline" className="justify-center">Master Builder</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">View Collection</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Mini-Games Card */}
            <Card className="border-[hsl(var(--space-blue))] border-opacity-30 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--space-blue))/5] to-transparent z-0"></div>
              <CardHeader className="relative z-10">
                <div className="p-2 rounded-full bg-[hsl(var(--space-blue))/10] w-fit mb-3">
                  <Gamepad2 className="h-6 w-6 text-[hsl(var(--space-blue))]" />
                </div>
                <CardTitle>Mini-Games</CardTitle>
                <CardDescription>Have fun while earning XP with themed games</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Featured Games:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-[hsl(var(--space-purple))/10] p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[hsl(var(--space-purple))/20] flex items-center justify-center">
                          <i className="ri-gamepad-line text-[hsl(var(--space-gold))]"></i>
                        </div>
                        <span className="text-sm font-medium">Trash Dash</span>
                      </div>
                      <Badge variant="outline" className="text-xs">1 XP</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-md bg-[hsl(var(--space-purple))/10] p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[hsl(var(--space-purple))/20] flex items-center justify-center">
                          <i className="ri-puzzle-line text-[hsl(var(--space-gold))]"></i>
                        </div>
                        <span className="text-sm font-medium">City Builder</span>
                      </div>
                      <Badge variant="outline" className="text-xs">1 XP</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-md bg-[hsl(var(--space-purple))/10] p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[hsl(var(--space-purple))/20] flex items-center justify-center">
                          <i className="ri-road-map-line text-[hsl(var(--space-gold))]"></i>
                        </div>
                        <span className="text-sm font-medium">Traffic Hero</span>
                      </div>
                      <Badge variant="outline" className="text-xs">1 XP</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10">
                <Link href="/games">
                  <Button variant="outline" className="w-full">Play Games</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="text-center">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-[hsl(var(--space-gold))] to-[hsl(var(--space-pink))] border-none">
                <span className="mr-2">
                  <Rocket className="h-4 w-4" />
                </span>
                Begin Your Cosmic Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[hsl(var(--space-blue))] via-[hsl(var(--space-purple)/20)] to-[hsl(var(--space-blue))] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-64 h-64 rounded-full bg-[hsl(var(--space-purple)/30)] blur-3xl -top-20 -right-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-[hsl(var(--space-pink)/20)] blur-3xl -bottom-20 -left-20"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block rounded-full bg-[hsl(var(--space-pink))/20] px-4 py-1.5 mb-6">
              <span className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[hsl(var(--space-gold))]" />
                Earn 5 XP for Submitting Your First Issue!
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Ready to Join the Cosmic Community Mission?
            </h2>
            <p className="text-[hsl(var(--foreground)/80)] text-lg mb-8 leading-relaxed">
              Your voice matters. Submit issues, earn rewards, and make a real difference in your community while having fun on your adventure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/submit')}
                className="bg-gradient-to-r from-[hsl(var(--space-gold))] to-[hsl(var(--space-pink))] border-none"
              >
                <i className="ri-rocket-2-line mr-2"></i>
                Submit New Issue
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/games')}
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Play Mini-Games
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)] relative group hover:shadow-lg transition-all duration-300">
                <div className="absolute -top-3 -right-3 bg-[hsl(var(--space-gold))] text-white rounded-full px-2 py-1 text-xs font-medium">
                  +5 XP
                </div>
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
                  <i className="ri-edit-line text-xl text-[hsl(var(--space-gold))]"></i>
                </div>
                <h3 className="font-semibold mb-2">Submit Issues</h3>
                <p className="text-sm text-[hsl(var(--foreground)/70)]">Document problems with details and photos to start community action</p>
              </div>
              
              <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)] relative group hover:shadow-lg transition-all duration-300">
                <div className="absolute -top-3 -right-3 bg-[hsl(var(--space-pink))] text-white rounded-full px-2 py-1 text-xs font-medium">
                  +1-2 XP
                </div>
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
                  <i className="ri-group-line text-xl text-[hsl(var(--space-gold))]"></i>
                </div>
                <h3 className="font-semibold mb-2">Participate</h3>
                <p className="text-sm text-[hsl(var(--foreground)/70)]">Comment on issues, vote for priorities, and connect with locals</p>
              </div>
              
              <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)] relative group hover:shadow-lg transition-all duration-300">
                <div className="absolute -top-3 -right-3 bg-[hsl(var(--space-blue))] text-white rounded-full px-2 py-1 text-xs font-medium">
                  +15 XP
                </div>
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lightbulb-line text-xl text-[hsl(var(--space-gold))]"></i>
                </div>
                <h3 className="font-semibold mb-2">Solve Together</h3>
                <p className="text-sm text-[hsl(var(--foreground)/70)]">Collaborate on solutions and earn rewards as you make progress</p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link href="/newsletter" className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-gold))] transition-colors">
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-mail-line"></i>
                  Subscribe to our newsletter to stay updated
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
