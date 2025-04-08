import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserActivity, UserNft } from "@shared/schema";
import { Loader2, Star, Calendar, Award, Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getProgressToNextLevel, getLevelTitle, formatXpProgress, getLevelColor } from "@/lib/xp-utils";
import { formatDate, DEFAULT_USER_ID } from "@/lib/utils";
import { getActivityName, getActivityIcon, formatXp } from "@/lib/activity-utils";

const DemoUserPage = () => {
  const [_, navigate] = useLocation();
  const { loginMutation } = useAuth();
  
  // Fetch the demo user directly
  const { data: demoUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/users/${DEFAULT_USER_ID}`],
    queryFn: async () => {
      const response = await fetch(`/api/users/${DEFAULT_USER_ID}`);
      if (!response.ok) throw new Error("Failed to fetch demo user");
      return response.json();
    },
  });
  
  // Fetch demo user's activities
  const { data: userActivities, isLoading: isLoadingActivities } = useQuery<UserActivity[]>({
    queryKey: ["/api/users", DEFAULT_USER_ID, "activities"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${DEFAULT_USER_ID}/activities`);
      if (!response.ok) throw new Error("Failed to fetch demo user activities");
      return response.json();
    },
    enabled: !!demoUser,
  });
  
  // Fetch demo user's NFTs
  const { data: userNFTs, isLoading: isLoadingNFTs } = useQuery<UserNft[]>({
    queryKey: ["/api/users", DEFAULT_USER_ID, "nfts"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${DEFAULT_USER_ID}/nfts`);
      if (!response.ok) throw new Error("Failed to fetch demo user NFTs");
      return response.json();
    },
    enabled: !!demoUser,
  });
  
  // Function to handle demo login
  const handleDemoLogin = async () => {
    try {
      await loginMutation.mutateAsync({ 
        username: "demo_user", 
        password: "password" 
      });
      navigate("/profile");
    } catch (error) {
      console.error("Failed to login as demo user:", error);
    }
  };
  
  // Get recent activities
  const getRecentActivities = () => {
    if (!userActivities || isLoadingActivities) return [];
    
    return [...userActivities]
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
      .slice(0, 5);
  };
  
  if (isLoadingUser) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!demoUser) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Demo user not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const userLevel = demoUser.level || 1;
  const levelTitle = getLevelTitle(userLevel);
  const levelColor = getLevelColor(userLevel);
  
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Demo User Account</CardTitle>
            <CardDescription>
              This is a pre-configured demo account with activity history for testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4">
                <AvatarFallback className="text-3xl">{demoUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{demoUser.name}</h1>
                <p className="text-muted-foreground">@{demoUser.username}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={`bg-[hsl(var(--space-${levelColor})/20)]`}>
                    Level {demoUser.level} - {levelTitle}
                  </Badge>
                  <Badge variant="outline" className="bg-[hsl(var(--space-pink)/20)]">
                    {demoUser.xp} XP Total
                  </Badge>
                  <Badge variant="outline" className="bg-[hsl(var(--space-gold)/20)]">
                    {isLoadingNFTs ? '...' : userNFTs?.length || 0} NFTs Owned
                  </Badge>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>XP: {demoUser.xp}</span>
                    <span>{formatXpProgress(demoUser.xp, demoUser.level)}</span>
                  </div>
                  <Progress value={getProgressToNextLevel(demoUser.xp, demoUser.level)} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleDemoLogin} disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login as Demo User"}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                The demo user has a history of activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="py-4 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : userActivities && userActivities.length > 0 ? (
                <ul className="space-y-3">
                  {getRecentActivities().map((activity) => (
                    <li key={activity.id} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {getActivityIcon(activity.activityId)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{getActivityName(activity.activityId)}</p>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatDate(activity.performedAt)}</span>
                          <span>+{formatXp(activity.xpEarned)} XP</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No activities found</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Details about the demo user account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className={`h-5 w-5 text-[hsl(var(--space-${levelColor}))]`} />
                  <span>Level</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{demoUser.level}</span>
                  <span className="text-sm text-muted-foreground">({levelTitle})</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[hsl(var(--space-gold))]" />
                  <span>Total XP</span>
                </div>
                <span className="font-medium">{demoUser.xp}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[hsl(var(--space-pink))]" />
                  <span>Votes</span>
                </div>
                <span className="font-medium">3</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[hsl(var(--space-blue))]" />
                  <span>Joined</span>
                </div>
                <span className="font-medium">{formatDate(demoUser.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoUserPage;