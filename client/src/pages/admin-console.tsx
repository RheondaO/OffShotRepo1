import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Settings, Users, Database, Shield, Activity, BarChart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

const AdminConsole = () => {
  const { isAdmin } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  
  // Check if user is admin
  useEffect(() => {
    if (isAdmin === false) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
    }
  }, [isAdmin, toast]);
  
  // Fetch users data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    // Rely on the default queryFn which is already configured in queryClient
    enabled: isAdmin !== false
  });
  
  // Fetch issues data
  const { data: issues, isLoading: issuesLoading } = useQuery({
    queryKey: ['/api/issues'],
    // Rely on the default queryFn which is already configured in queryClient
    enabled: isAdmin !== false
  });
  
  // Impersonate user mutation
  const impersonateMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest('POST', `/api/admin/impersonate/${userId}`, {
        userId: userId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "User Impersonated",
        description: "You are now viewing the site as this user.",
      });
    },
    onError: (error) => {
      toast({
        title: "Impersonation Failed",
        description: error.message || "Failed to impersonate user.",
        variant: "destructive"
      });
    }
  });
  
  // If not admin, show access denied
  if (isAdmin === false) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin console.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This area is restricted to administrators only.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Console</h1>
        <p className="text-muted-foreground">
          Manage users, content, and system settings
        </p>
      </div>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Issues</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableCaption>List of all users in the system</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(users) && users.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={user.photoUrl} />
                                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{user.name}</div>
                                <div className="text-sm text-muted-foreground">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-[hsl(var(--primary)/10)]">
                              Level {user.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                user.role === 'admin' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8"
                                onClick={() => impersonateMutation.mutate(user.id)}
                                disabled={impersonateMutation.isPending}
                              >
                                {impersonateMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                ) : (
                                  <Shield className="h-3 w-3 mr-2" />
                                )}
                                Impersonate
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8"
                                onClick={() => window.open(`/profile?userId=${user.id}`, '_blank')}
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Management</CardTitle>
              <CardDescription>
                View and manage content issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issuesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-[350px]" />
                      <Skeleton className="h-4 w-[300px]" />
                      <Skeleton className="h-4 w-[400px]" />
                      <Skeleton className="h-0.5 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableCaption>List of all issues in the system</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(issues) && issues.map((issue: any) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">
                            <div>
                              {issue.title}
                              <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                {issue.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {issue.author?.name || 'Anonymous'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                issue.status === 'open' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : issue.status === 'closed'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }
                            >
                              {issue.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{issue.votes || 0}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8"
                                onClick={() => window.open(`/issues/${issue.id}`, '_blank')}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-registration" className="text-base">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                  </div>
                  <Switch id="enable-registration" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Take the site offline for maintenance</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-comments" className="text-base">Allow Comments</Label>
                    <p className="text-sm text-muted-foreground">Enable commenting on issues</p>
                  </div>
                  <Switch id="allow-comments" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-announcement" className="text-base">Site Announcement</Label>
                  <p className="text-sm text-muted-foreground">Display a sitewide announcement to all users</p>
                  <Input id="site-announcement" placeholder="Important announcement text..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-interval" className="text-base">Database Backup Interval (days)</Label>
                  <p className="text-sm text-muted-foreground">How often to backup the database</p>
                  <Input id="backup-interval" type="number" defaultValue="7" min="1" max="30" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Manage database operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Database Status:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Connected
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">PostgreSQL Database</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    Backup Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Restore Backup
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive">
                    Reset Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>
                View platform usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">{Array.isArray(users) ? users.length : 0}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Active Issues</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">
                      {Array.isArray(issues) ? issues.filter(issue => issue.status === 'open').length : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Total Votes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">
                      {Array.isArray(issues) ? issues.reduce((acc, issue) => acc + (issue.votes || 0), 0) : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">+26% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <p className="text-center text-lg font-medium mb-4">User Growth Chart (Placeholder)</p>
                <div className="h-[250px] w-full bg-muted/20 rounded-md border flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent platform events and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {[
                    { user: "Alex Johnson", action: "created a new issue", time: "2 hours ago" },
                    { user: "Sam Rodriguez", action: "voted on 'Fix mobile responsiveness'", time: "3 hours ago" },
                    { user: "Tina Murphy", action: "commented on 'Add dark mode'", time: "5 hours ago" },
                    { user: "Robert Smith", action: "registered a new account", time: "6 hours ago" },
                    { user: "Admin", action: "updated system settings", time: "1 day ago" },
                    { user: "Jessica Wu", action: "closed issue 'Update privacy policy'", time: "1 day ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminConsole;