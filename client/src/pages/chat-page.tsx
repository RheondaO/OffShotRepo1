import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatPanel from "@/components/chat/ChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelTopClose, Calendar as CalendarIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

// Simple component for scheduling debates
function DebateScheduler() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  
  const scheduleMutation = useMutation({
    mutationFn: async (data: { topic: string; scheduledFor: Date }) => {
      try {
        const response = await apiRequest("POST", "/api/debates", data);
        return await response.json();
      } catch (error) {
        console.error("Failed to schedule debate:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Debate scheduled",
        description: "Your debate has been scheduled successfully.",
      });
      setTopic("");
      setDate(undefined);
    },
    onError: () => {
      toast({
        title: "Failed to schedule debate",
        description: "There was an error scheduling your debate. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && date) {
      scheduleMutation.mutate({ topic, scheduledFor: date });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Debate</CardTitle>
        <CardDescription>
          Create a new topic for community discussion
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="topic">Debate Topic</Label>
            <Input
              id="topic"
              placeholder="Enter the topic for discussion"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="date">Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={!topic || !date || scheduleMutation.isPending}
          >
            {scheduleMutation.isPending ? "Scheduling..." : "Schedule Debate"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ChatPage() {
  const [username, setUsername] = useState("Anonymous");
  const [savedUsername, setSavedUsername] = useState<string | null>(null);
  const { toast } = useToast();

  // Try to load username from local storage on initial load
  useEffect(() => {
    const savedName = localStorage.getItem("chat-username");
    if (savedName) {
      setUsername(savedName);
      setSavedUsername(savedName);
    }
  }, []);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim()) {
      localStorage.setItem("chat-username", username);
      setSavedUsername(username);
      
      toast({
        title: "Username set",
        description: `You will now appear as "${username}" in the chat.`,
      });
    }
  };

  return (
    <div className="container max-w-screen-xl py-6 lg:py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Community Chat</h1>
          <p className="mt-2 text-muted-foreground">
            Connect with other community members in real-time to discuss local issues,
            share ideas, and build a stronger community together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[calc(100vh-300px)] lg:h-[600px]">
              <Tabs defaultValue="chat">
              <TabsList>
                <TabsTrigger value="chat">General Chat</TabsTrigger>
                <TabsTrigger value="local">Local Chat</TabsTrigger>
                <TabsTrigger value="debates">Debates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <ChatPanel username={savedUsername || "Anonymous"} />
              </TabsContent>
              
              <TabsContent value="local">
                <ChatPanel 
                  username={savedUsername || "Anonymous"}
                  room="local"
                  location={localStorage.getItem("user-location") || undefined}
                />
              </TabsContent>
              
              <TabsContent value="debates">
                <div className="space-y-4">
                  <DebateScheduler />
                  <ChatPanel 
                    username={savedUsername || "Anonymous"}
                    room="debates"
                  />
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Tabs defaultValue="account" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Username</CardTitle>
                    <CardDescription>
                      Choose how you'll appear in the community chat.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUsernameSubmit}>
                    <CardContent>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            placeholder="Your name or nickname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Save</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Chat</CardTitle>
                    <CardDescription>
                      How the community chat works
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Real-Time Conversations</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Messages appear instantly for all connected users, allowing
                        for dynamic discussions about community issues.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Community Guidelines</h4>
                      <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                        <li>Be respectful to other community members</li>
                        <li>Stay on topic and discuss relevant issues</li>
                        <li>No spam, advertising, or self-promotion</li>
                        <li>Keep conversations constructive and inclusive</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Privacy Note</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Chat history is not permanently stored. Messages are only
                        available during your current session and for other currently
                        connected users.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}