import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatPanel from "@/components/chat/ChatPanel";
import RoomSelector from "@/components/chat/RoomSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelTopClose, Calendar as CalendarIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

// Enhanced component for scheduling and viewing debates
function DebateScheduler() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const [scheduledDebates, setScheduledDebates] = useState<Array<{
    id: number;
    topic: string;
    scheduledFor: string;
  }>>([
    { id: 1, topic: "Environmental Policy Changes", scheduledFor: "2025-05-15T14:00:00Z" },
    { id: 2, topic: "Local Transportation Improvements", scheduledFor: "2025-05-20T18:30:00Z" }
  ]);
  
  // Schedule a new debate
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
    onSuccess: (data) => {
      toast({
        title: "Debate scheduled",
        description: "Your debate has been scheduled successfully.",
      });
      // Add the new debate to the list
      setScheduledDebates(prev => [...prev, data]);
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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="mb-2">
        <h1 className="text-lg font-bold">Community Debates</h1>
        <p className="text-xs text-muted-foreground">
          Schedule and participate in structured discussions about community issues.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-3 overflow-auto pb-2 flex-1" style={{ maxHeight: "360px" }}>
        {/* Left column */}
        <div className="space-y-3">
          {/* Schedule form */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Schedule a Debate</CardTitle>
              <CardDescription className="text-xs">
                Create a new topic for community discussion
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-3 pb-3">
                <div className="space-y-1">
                  <Label htmlFor="topic" className="text-sm">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="Enter the topic for discussion"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="date" className="text-sm">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-8 text-sm",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
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
              <CardFooter className="pt-0">
                <Button 
                  type="submit" 
                  disabled={!topic || !date || scheduleMutation.isPending}
                  size="sm"
                >
                  {scheduleMutation.isPending ? "Scheduling..." : "Schedule Debate"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* How debates work - simplified */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">How Debates Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <CalendarIcon className="h-5 w-5 text-primary mb-1" />
                  <h3 className="font-medium text-xs">Schedule</h3>
                  <p className="text-xs text-muted-foreground">
                    Propose topics & vote
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <PanelTopClose className="h-5 w-5 text-primary mb-1" />
                  <h3 className="font-medium text-xs">Participate</h3>
                  <p className="text-xs text-muted-foreground">
                    Join live discussions
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary mb-1">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                  <h3 className="font-medium text-xs">Impact</h3>
                  <p className="text-xs text-muted-foreground">
                    Drive community action
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column */}
        <div>
          {/* Upcoming debates */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming Debates</CardTitle>
              <CardDescription className="text-xs">
                Join these scheduled community debates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                {scheduledDebates.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No debates currently scheduled.
                  </p>
                ) : (
                  scheduledDebates.map(debate => (
                    <div 
                      key={debate.id}
                      className="border rounded-lg p-2 space-y-1"
                    >
                      <h3 className="font-medium text-sm">{debate.topic}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {format(new Date(debate.scheduledFor), "PPP 'at' p")}
                      </div>
                      <Button variant="outline" size="sm" className="w-full text-xs h-7 mt-1">
                        Set Reminder
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Create a wrapper component that prevents scroll propagation
function ChatTabWrapper({ children, isActive }: { 
  children: React.ReactNode;
  isActive: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // On first render, mark initial render as complete
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, [isInitialRender]);
  
  // Handle tab activation/deactivation
  useEffect(() => {
    // Don't do anything on initial render
    if (isInitialRender) return;
    
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    if (!isActive) {
      // When tab becomes inactive, store its current scroll position
      wrapper.dataset.scrollPosition = wrapper.scrollTop.toString();
      // Reset scroll to prevent affecting other tabs
      wrapper.scrollTop = 0;
    } else if (wrapper.dataset.scrollPosition) {
      // When tab becomes active again, restore its previous scroll position
      const scrollPos = parseInt(wrapper.dataset.scrollPosition, 10);
      // Use timeout to ensure DOM is ready
      setTimeout(() => {
        if (isActive && wrapper) {
          wrapper.scrollTop = scrollPos;
        }
      }, 50);
    }
  }, [isActive, isInitialRender]);
  
  return (
    <div 
      ref={wrapperRef}
      className={`h-full ${isActive ? 'block' : 'hidden'}`}
      style={{ 
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        // Important: prevent scroll events from propagating to parent
        isolation: 'isolate'
      }}
    >
      {children}
    </div>
  );
}

export default function ChatPage() {
  const [username, setUsername] = useState("Anonymous");
  const [savedUsername, setSavedUsername] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
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

        {/* Main content with a fixed height container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden" style={{ height: "480px" }}>
              <Tabs 
                defaultValue="chat" 
                value={activeTab} 
                onValueChange={(value) => {
                  // Only change the tab if it's different
                  if (value !== activeTab) {
                    setActiveTab(value);
                    
                    // Important: Delay any DOM updates until after the tab change
                    requestAnimationFrame(() => {
                      // This will run after the tab change has been processed
                      console.log("Tab changed to:", value);
                    });
                  }
                }}
                className="h-full flex flex-col"
              >
                <TabsList>
                  <TabsTrigger value="chat">General Chat</TabsTrigger>
                  <TabsTrigger value="local">Rooms</TabsTrigger>
                  <TabsTrigger value="debates">Debates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" forceMount className="relative h-[calc(100%-40px)]">
                  <ChatTabWrapper isActive={activeTab === "chat"}>
                    <ChatPanel 
                      username={savedUsername || "Anonymous"} 
                      isActive={activeTab === "chat"}
                    />
                  </ChatTabWrapper>
                </TabsContent>
                
                <TabsContent value="local" forceMount className="relative h-[calc(100%-40px)]">
                  <ChatTabWrapper isActive={activeTab === "local"}>
                    {activeTab === "local" && (
                      <RoomSelector
                        username={savedUsername || "Anonymous"}
                        onJoinRoom={(roomId) => {
                          toast({
                            title: "Joined Room",
                            description: `You've joined the ${roomId} room.`,
                          });
                          
                          // In a production app, we would transition to the room chat here
                          // For now, we'll just show a toast and log the join
                          console.log(`User ${savedUsername || "Anonymous"} joined room: ${roomId}`);
                        }}
                      />
                    )}
                  </ChatTabWrapper>
                </TabsContent>
                
                <TabsContent value="debates" forceMount className="relative h-[calc(100%-40px)]">
                  <ChatTabWrapper isActive={activeTab === "debates"}>
                    {/* Only show the debate scheduler in this tab */}
                    {activeTab === "debates" && <DebateScheduler />}
                  </ChatTabWrapper>
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