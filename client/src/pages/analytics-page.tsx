import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  TrendingUp, 
  Users, 
  Calendar, 
  Filter,
  MapPin,
  Map as MapIcon 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Issue, type Category } from "@shared/schema";
import IssueMap from "@/components/analytics/IssueMap";

// Chart colors
const COLORS = [
  "hsl(var(--space-blue))",
  "hsl(var(--space-pink))",
  "hsl(var(--space-gold))",
  "hsl(var(--space-purple))",
  "hsl(var(--primary))"
];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Fetch issues for analytics
  const { data: issues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ['/api/issues'],
  });
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Data transformation functions
  const getIssuesByCategory = () => {
    if (!issues || !categories) return [];
    
    // Count issues per category
    const categoryCounts = categories.map(category => {
      const count = issues.filter(issue => issue.categoryId === category.id).length;
      return {
        name: category.name,
        value: count,
        id: category.id
      };
    }).filter(item => item.value > 0);
    
    return categoryCounts;
  };
  
  const getTopVotedIssues = () => {
    if (!issues) return [];
    
    // Sort issues by votes and take top 5
    return [...issues]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, 5)
      .map(issue => ({
        name: issue.title.length > 25 ? issue.title.substring(0, 25) + '...' : issue.title,
        votes: issue.votes || 0,
      }));
  };
  
  const getIssuesByMonth = () => {
    if (!issues) return [];
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Create data for the past 6 months
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentDate.getMonth() - i, 1);
      const monthStr = months[month.getMonth()];
      
      const count = issues.filter(issue => {
        const issueDate = new Date(issue.createdAt);
        return issueDate.getMonth() === month.getMonth() && 
               issueDate.getFullYear() === month.getFullYear();
      }).length;
      
      data.push({
        name: monthStr,
        issues: count,
      });
    }
    
    return data;
  };
  
  // Filter issues by selected category (for detailed view)
  const getFilteredIssues = () => {
    if (!issues) return [];
    
    let filtered = [...issues];
    
    // Apply category filter if not 'all'
    if (categoryFilter !== "all" && categoryFilter !== "") {
      filtered = filtered.filter(issue => issue.categoryId === parseInt(categoryFilter));
    }
    
    // Apply time range filter
    if (timeRange !== "all") {
      const now = new Date();
      let startDate;
      
      switch(timeRange) {
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "quarter":
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      filtered = filtered.filter(issue => new Date(issue.createdAt) >= startDate);
    }
    
    return filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
  };
  
  // Calculate statistics
  const getTotalIssueCount = () => issues?.length || 0;
  const getTotalVoteCount = () => issues?.reduce((sum, issue) => sum + (issue.votes || 0), 0) || 0;
  const getAverageVotesPerIssue = () => {
    if (!issues || issues.length === 0) return 0;
    return (getTotalVoteCount() / issues.length).toFixed(1);
  };
  
  const filteredIssues = getFilteredIssues();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-[hsl(var(--foreground)/70)] mb-6">
          Explore insights about community issues and engagement trends
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--foreground)/70)]">
                Total Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-[hsl(var(--space-pink))] mr-2" />
                <span className="text-2xl font-bold">{getTotalIssueCount()}</span>
              </div>
              <p className="text-xs mt-2 text-[hsl(var(--foreground)/60)]">
                The total number of community issues submitted to the platform for tracking and resolution
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--foreground)/70)]">
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--space-blue))] mr-2" />
                <span className="text-2xl font-bold">{getTotalVoteCount()}</span>
              </div>
              <p className="text-xs mt-2 text-[hsl(var(--foreground)/60)]">
                The cumulative count of all votes cast across all issues, indicating overall community engagement
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--foreground)/70)]">
                Average Votes per Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-[hsl(var(--space-gold))] mr-2" />
                <span className="text-2xl font-bold">{getAverageVotesPerIssue()}</span>
              </div>
              <p className="text-xs mt-2 text-[hsl(var(--foreground)/60)]">
                The mean number of votes per issue, reflecting typical community interest in submitted concerns
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Issue Details</TabsTrigger>
          <TabsTrigger value="map">Geographic Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
                <CardDescription>Distribution of issues across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {issuesLoading || categoriesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p>Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getIssuesByCategory()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {getIssuesByCategory().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <p className="text-xs mt-4 text-[hsl(var(--foreground)/60)]">
                  This pie chart shows how issues are distributed across different categories, helping identify which areas receive the most community attention.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Voted Issues</CardTitle>
                <CardDescription>Issues with the most community votes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {issuesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p>Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getTopVotedIssues()}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="votes" fill="hsl(var(--space-pink))" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <p className="text-xs mt-4 text-[hsl(var(--foreground)/60)]">
                  This bar chart highlights the most popular issues based on community votes, indicating which concerns have gained the most support.
                </p>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Issues Over Time</CardTitle>
                <CardDescription>Monthly issues created over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {issuesLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p>Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getIssuesByMonth()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="issues" 
                          stroke="hsl(var(--space-blue))" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <p className="text-xs mt-4 text-[hsl(var(--foreground)/60)]">
                  This trend line shows the number of new issues submitted each month, helping identify patterns in community engagement and seasonal variations.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Issue Analysis</CardTitle>
                  <CardDescription>Detailed view of issues with filtering options</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[hsl(var(--foreground)/70)]" />
                    <Select
                      value={timeRange}
                      onValueChange={setTimeRange}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                        <SelectItem value="quarter">Past 3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[hsl(var(--foreground)/70)]" />
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {issuesLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading issues data...</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 p-4 text-sm font-medium text-[hsl(var(--foreground)/70)] bg-[hsl(var(--secondary)/20)]">
                      <div className="col-span-6">Issue</div>
                      <div className="col-span-2 text-center">Category</div>
                      <div className="col-span-2 text-center">Votes</div>
                      <div className="col-span-2 text-center">Created</div>
                    </div>
                    
                    <div className="divide-y">
                      {filteredIssues.length > 0 ? (
                        filteredIssues.map(issue => {
                          const category = categories?.find(c => c.id === issue.categoryId);
                          const createdAt = new Date(issue.createdAt).toLocaleDateString();
                          
                          return (
                            <div key={issue.id} className="grid grid-cols-12 p-4 text-sm items-center">
                              <div className="col-span-6 font-medium truncate">{issue.title}</div>
                              <div className="col-span-2 text-center">
                                <Badge variant="outline">{category?.name}</Badge>
                              </div>
                              <div className="col-span-2 text-center font-medium">
                                {issue.votes || 0}
                              </div>
                              <div className="col-span-2 text-center text-[hsl(var(--foreground)/70)]">
                                {createdAt}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-[hsl(var(--foreground)/70)]">
                          No issues match the selected filters
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-sm text-[hsl(var(--foreground)/70)]">
                    <div>
                      Showing <span className="font-medium">{filteredIssues.length}</span> of <span className="font-medium">{issues?.length || 0}</span> issues
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { 
                      setTimeRange("all");
                      setCategoryFilter("all");
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Geographic Distribution of Issues</CardTitle>
                  <CardDescription>
                    View issues mapped by location to see geographical patterns
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[hsl(var(--foreground)/70)]" />
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {issuesLoading || categoriesLoading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <p>Loading map data...</p>
                </div>
              ) : (
                <div className="h-[600px]">
                  <IssueMap 
                    issues={issues || []} 
                    categories={categories || []} 
                    selectedCategoryId={categoryFilter} 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;