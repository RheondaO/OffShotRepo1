import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import IssueCard from "@/components/issues/IssueCard";
import CategoryCard from "@/components/issues/CategoryCard";
import IssueTable from "@/components/issues/IssueTable";
import SearchBar from "@/components/ui/search";
import { type Category, type Issue } from "@shared/schema";

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
                Discover & Shape
              </span>
              <span className="block">Community Issues</span>
            </h2>
            <p className="text-[hsl(var(--foreground)/80)] text-lg md:text-xl mb-8 leading-relaxed">
              Explore challenges raised by your community and contribute to solving them together in this cosmic collaboration space.
            </p>
            
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
              >
                Browse All Issues
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/submit')}
              >
                Submit New Issue
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
                <div key={i} className="card bg-[hsl(var(--space-gray)/50)] rounded-xl h-64 animate-pulse"></div>
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
                <div key={i} className="card bg-[hsl(var(--space-gray)/40)] rounded-xl h-40 animate-pulse"></div>
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
            <div className="card bg-[hsl(var(--space-gray)/30)] rounded-xl h-64 animate-pulse"></div>
          ) : trendingIssues && trendingIssues.length > 0 ? (
            <IssueTable issues={trendingIssues} />
          ) : (
            <div className="text-center py-12 text-[hsl(var(--foreground)/60)]">
              No trending issues yet. Be the first to submit an issue!
            </div>
          )}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Have an Issue to Share?
            </h2>
            <p className="text-[hsl(var(--foreground)/80)] text-lg mb-8 leading-relaxed">
              Your voice matters. Submit a community issue and help build a better tomorrow for everyone.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/submit')}
            >
              Submit New Issue
            </Button>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)]">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
                  <i className="ri-edit-line text-xl text-[hsl(var(--space-gold))]"></i>
                </div>
                <h3 className="font-semibold mb-2">Create</h3>
                <p className="text-sm text-[hsl(var(--foreground)/70)]">Submit your issue with details, photos, and location information</p>
              </div>
              
              <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)]">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
                  <i className="ri-group-line text-xl text-[hsl(var(--space-gold))]"></i>
                </div>
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-sm text-[hsl(var(--foreground)/70)]">Build support from neighbors and local community members</p>
              </div>
              
              <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)]">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lightbulb-line text-xl text-[hsl(var(--space-gold))]"></i>
                </div>
                <h3 className="font-semibold mb-2">Solve</h3>
                <p className="text-sm text-[hsl(var(--foreground)/70)]">Collaborate on solutions and track progress together</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
