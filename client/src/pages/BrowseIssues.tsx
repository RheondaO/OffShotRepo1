import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import IssueCard from "@/components/issues/IssueCard";
import { IssueCardSkeleton } from "@/components/issues/IssueCardSkeleton";
import SearchBar from "@/components/ui/search";
import { type Category, type Issue } from "@shared/schema";

interface IssueWithCategory extends Issue {
  category?: Category | null;
}

const BrowseIssues = () => {
  const [location] = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('categoryId');
    const search = params.get('search');
    
    if (categoryId) {
      setSelectedCategoryId(parseInt(categoryId));
    }
    
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);
  
  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Build query string with includeCategoryData parameter
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (selectedCategoryId) {
      params.append('categoryId', selectedCategoryId.toString());
    } else if (searchQuery) {
      params.append('search', searchQuery);
    }
    
    // Always include category data for better performance
    params.append('includeCategoryData', 'true');
    
    return params.toString();
  };
  
  // Fetch issues based on filters with included category data
  const queryString = buildQueryString();
  const issuesQueryKey = [`/api/issues?${queryString}`];
  
  const { data: issues, isLoading: isIssuesLoading, error: issuesError } = useQuery<IssueWithCategory[]>({
    queryKey: issuesQueryKey,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 30000
  });
  
  // Get selected category name
  const getSelectedCategoryName = () => {
    if (!selectedCategoryId || !categories) return null;
    const category = categories.find(cat => cat.id === selectedCategoryId);
    return category?.name || null;
  };
  
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Browse Community Issues
          </h1>
          <p className="text-[hsl(var(--foreground)/70)] mb-8">
            Discover issues that matter to your community and lend your support
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-8 px-4 sm:px-0">
            <SearchBar className="w-full sm:max-w-lg" />
            <Link href="/submit" className="sm:flex-shrink-0">
              <Button className="w-full sm:w-auto whitespace-nowrap">
                <i className="ri-add-line mr-1"></i> Submit New Issue
              </Button>
            </Link>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button 
              variant={!selectedCategoryId ? "default" : "category"}
              onClick={() => setSelectedCategoryId(null)}
            >
              All
            </Button>
            
            {isCategoriesLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Button key={i} variant="category" disabled>Loading...</Button>
              ))
            ) : (
              categories?.map((category) => (
                <Button 
                  key={category.id} 
                  variant={selectedCategoryId === category.id ? "default" : "category"}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </Button>
              ))
            )}
          </div>
        </div>
        
        {/* Display filters and results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategoryId ? (
              <>
                <span className="inline-block mr-2">
                  <i className="ri-filter-line text-[hsl(var(--space-gold))]"></i>
                </span>
                {getSelectedCategoryName()} Issues
              </>
            ) : searchQuery ? (
              <>
                <span className="inline-block mr-2">
                  <i className="ri-search-line text-[hsl(var(--space-gold))]"></i>
                </span>
                Search Results: "{searchQuery}"
              </>
            ) : (
              <>
                <span className="inline-block mr-2">
                  <i className="ri-list-check text-[hsl(var(--space-gold))]"></i>
                </span>
                All Issues
              </>
            )}
          </h2>
        </div>
        
        {/* Issues grid */}
        {isIssuesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <IssueCardSkeleton key={i} />
            ))}
          </div>
        ) : issues && issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[hsl(var(--space-gray)/30)] rounded-xl border border-[hsl(var(--space-purple)/20)]">
            <i className="ri-inbox-line text-4xl text-[hsl(var(--foreground)/40)] mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No issues found</h3>
            <p className="text-[hsl(var(--foreground)/60)] mb-6">
              {selectedCategoryId 
                ? "There are no issues in this category yet." 
                : searchQuery 
                ? "No issues match your search criteria." 
                : "There are no issues yet."}
            </p>
            <Link href="/submit">
              <Button size="lg">Submit a New Issue</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseIssues;
