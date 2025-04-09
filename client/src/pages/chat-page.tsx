import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatPanel from "@/components/chat/ChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelTopClose } from "lucide-react";

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
                  location={localStorage.getItem("user-location")}
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