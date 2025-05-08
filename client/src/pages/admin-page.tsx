import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  RefreshCw, 
  UserPlus, 
  Users, 
  BarChart3, 
  Activity, 
  Award,
  TrendingUp,
  Filter,
  User,
  Eye,
  Mail,
  Shield,
  Settings,
  Download,
  FileBarChart,
  BellRing
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation, Link } from "wouter";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Check if user has admin access
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/user/admincheck');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        
        if (!data.isAdmin) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have permission to access the admin panel."
          });
          
          // Redirect after a short delay
          setTimeout(() => {
            setLocation('/');
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify admin permissions."
        });
      }
    };
    
    checkAdminStatus();
  }, [setLocation, toast]);
  
  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: !!isAdmin
  });
  
  // Fetch test users (users marked as test accounts)
  const { data: testUsers = [], isLoading: testUsersLoading, error: testUsersError } = useQuery<any[]>({
    queryKey: ['/api/users/test'],
    enabled: !!isAdmin
  });
  
  // Create a new test user
  const createTestUserMutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      name: string;
      email: string;
      password: string;
      isTest: boolean;
    }) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Test user created successfully.",
      });
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/test'] });
      
      // Reset form
      setNewTestUser({
        username: '',
        name: '',
        email: '',
        password: 'testuser123',
        isTest: true
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create test user: ${error.message}`,
      });
    }
  });
  
  // State for new test user form
  const [newTestUser, setNewTestUser] = useState({
    username: '',
    name: '',
    email: '',
    password: 'testuser123', // Default password for test users
    isTest: true
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTestUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTestUserMutation.mutate(newTestUser);
  };
  
  // If admin status is still being checked, show loading
  if (isAdmin === null) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Skeleton className="h-6 w-40" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If not admin, show access denied
  if (isAdmin === false) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin panel. Redirecting to the homepage...
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Admin Panel</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage the platform settings, users, and content.
          </p>
        </div>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="test-users">Test Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            {/* Overview stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-10 w-10 text-primary/80" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <h3 className="text-2xl font-bold">{usersLoading ? <Skeleton className="h-8 w-16" /> : (users?.length || 0)}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={65} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">+12% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-10 w-10 text-primary/80" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                      <h3 className="text-2xl font-bold">248</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={78} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">+23% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-10 w-10 text-primary/80" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total XP Awarded</p>
                      <h3 className="text-2xl font-bold">12,543</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={92} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">+38% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-10 w-10 text-primary/80" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                      <h3 className="text-2xl font-bold">86%</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={86} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">+7% from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent activity and quick actions */}
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Platform Activity
                  </CardTitle>
                  <CardDescription>
                    Latest user interactions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px]">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <User className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">New User Registration</span>
                            <Badge variant="outline" className="ml-2">User</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sarah Johnson created a new account
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            10 minutes ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <TrendingUp className="mt-1 h-5 w-5 text-green-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Issue Trending</span>
                            <Badge variant="outline" className="ml-2">Issue</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            "Downtown Bike Lane Safety" issue is trending with 24 new votes
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            32 minutes ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <Award className="mt-1 h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Achievement Unlocked</span>
                            <Badge variant="outline" className="ml-2">XP</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Miguel Sanchez reached Level 5 and earned "Community Voice" badge
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <BellRing className="mt-1 h-5 w-5 text-blue-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">New Debate Scheduled</span>
                            <Badge variant="outline" className="ml-2">Debate</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            New community debate "Urban Transit Solutions" scheduled for tomorrow
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <Shield className="mt-1 h-5 w-5 text-red-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Content Moderation</span>
                            <Badge variant="outline" className="ml-2">Admin</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Admin removed 3 comments for violating community guidelines
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            4 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    View User Management
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Reported Content
                    <Badge className="ml-auto" variant="secondary">3</Badge>
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <FileBarChart className="mr-2 h-4 w-4" />
                    Generate Analytics Report
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Newsletter
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Platform Data
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* User metrics and active users */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    User Growth Metrics
                  </CardTitle>
                  <CardDescription>
                    User registration and activity trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Analytics Charts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Charts will display here with real data integration
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Most Active Users
                  </CardTitle>
                  <CardDescription>
                    Users with highest engagement this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Elena Rodriguez</p>
                          <p className="text-xs text-muted-foreground">Level 8 • Eco Warrior</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">2,345 XP</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Jamal Washington</p>
                          <p className="text-xs text-muted-foreground">Level 7 • Problem Solver</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">1,982 XP</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mia Chen</p>
                          <p className="text-xs text-muted-foreground">Level 6 • Debate Champion</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">1,756 XP</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">David Park</p>
                          <p className="text-xs text-muted-foreground">Level 5 • Issue Hunter</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">1,430 XP</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Olivia Smith</p>
                          <p className="text-xs text-muted-foreground">Level 5 • Civic Leader</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">1,289 XP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="test-users" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Create test user form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Test User
                  </CardTitle>
                  <CardDescription>
                    Create test accounts for platform demonstration and testing
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        name="username"
                        placeholder="test_user1" 
                        value={newTestUser.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        placeholder="Test User" 
                        value={newTestUser.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        placeholder="test@example.com" 
                        value={newTestUser.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        name="password"
                        type="password"
                        placeholder="••••••••" 
                        value={newTestUser.password}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Default password for test users: "testuser123"
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="isTest" 
                        checked={newTestUser.isTest}
                        onCheckedChange={(checked) => 
                          setNewTestUser(prev => ({...prev, isTest: !!checked}))
                        }
                      />
                      <Label htmlFor="isTest" className="text-sm font-normal">
                        Mark as test account (helps identify test data)
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={createTestUserMutation.isPending}
                      className="w-full"
                    >
                      {createTestUserMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : "Create Test User"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              {/* Test user instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    Test User Instructions
                  </CardTitle>
                  <CardDescription>
                    Information for managing test accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Purpose of Test Users</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Test users are special accounts that can be used for demonstrations, 
                      UI testing, or showing platform features to stakeholders without 
                      affecting real user data.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Test User Features</h3>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                      <li>Automatically populate with sample data</li>
                      <li>Clearly marked as test accounts to prevent confusion</li>
                      <li>Can be easily reset or deleted without affecting real data</li>
                      <li>Test activities don't impact analytics or statistics</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Best Practices</h3>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                      <li>Use descriptive usernames (e.g., test_admin, test_regular)</li>
                      <li>Document the purpose of each test user</li>
                      <li>Periodically clean up unused test accounts</li>
                      <li>Use a standard password for all test accounts</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Test user list */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Test User Management
                </CardTitle>
                <CardDescription>
                  View, edit and manage test accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testUsersLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : testUsersError ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error loading test users</AlertTitle>
                    <AlertDescription>
                      Failed to load test users. Please try again.
                    </AlertDescription>
                    <Button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users/test'] })}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testUsers && testUsers.length > 0 ? (
                          testUsers.map((user: any) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.username}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.isActive ? "default" : "secondary"}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button asChild variant="outline" size="sm">
                                    <Link to={`/users/${user.id}`}>
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Link>
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              No test users found. Create one using the form above.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {testUsers.length} test users available
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users/test'] })}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Database</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">Connected</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Services</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">Online</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">WebSocket</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cache</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">Healthy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Status
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>User activity overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Users</span>
                      <span className="text-sm">{usersLoading ? '...' : (users?.length || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Test Users</span>
                      <span className="text-sm">{testUsersLoading ? '...' : (testUsers?.length || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Today</span>
                      <span className="text-sm">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">New (7 days)</span>
                      <span className="text-sm">18</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Commonly used admin functions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Reset Demo Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    Rebuild Cache
                  </Button>
                  <Button className="w-full" variant="outline">
                    Export User Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and errors</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <div className="p-4 space-y-2 font-mono text-xs">
                    <div className="flex">
                      <span className="text-green-500 mr-2">[INFO]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:34:56</span>
                      <span>User login successful: admin_user</span>
                    </div>
                    <div className="flex">
                      <span className="text-amber-500 mr-2">[WARN]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:30:22</span>
                      <span>Rate limit triggered for IP: 192.168.1.100</span>
                    </div>
                    <div className="flex">
                      <span className="text-green-500 mr-2">[INFO]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:22:15</span>
                      <span>New issue created: ID #456</span>
                    </div>
                    <div className="flex">
                      <span className="text-green-500 mr-2">[INFO]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:15:30</span>
                      <span>WebSocket connection established for user: test_user</span>
                    </div>
                    <div className="flex">
                      <span className="text-red-500 mr-2">[ERROR]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:10:05</span>
                      <span>Failed user login attempt: unknown_user</span>
                    </div>
                    <div className="flex">
                      <span className="text-green-500 mr-2">[INFO]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:05:18</span>
                      <span>System backup completed successfully</span>
                    </div>
                    <div className="flex">
                      <span className="text-green-500 mr-2">[INFO]</span>
                      <span className="text-muted-foreground mr-2">2025-05-08 12:00:00</span>
                      <span>Scheduled maintenance tasks started</span>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="Community Engagement Platform" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" defaultValue="support@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Select defaultValue="off">
                    <SelectTrigger id="maintenance-mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="on">On (Site Offline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="allow-registration" defaultChecked />
                  <Label htmlFor="allow-registration">Allow new user registrations</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enable-notifications" defaultChecked />
                  <Label htmlFor="enable-notifications">Enable email notifications</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Admin Instructions</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  This admin panel gives you access to manage the platform. Here are some tips:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Test users are specially marked accounts that don't affect real analytics</li>
                  <li>Use test users for demonstrations, training, and feature testing</li>
                  <li>Regularly check system logs for any unexpected errors or issues</li>
                  <li>The settings page allows you to configure global platform behaviors</li>
                  <li>For database-level changes, please contact the development team</li>
                </ul>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}