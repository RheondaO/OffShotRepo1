import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Users, 
  Heart, 
  BookOpen, 
  Smile, 
  Locate, 
  LucideIcon, 
  Music, 
  Dumbbell,
  Coffee,
  Code
} from "lucide-react";

// Type definitions
export type RoomCategory = 
  | "location" 
  | "age" 
  | "interest" 
  | "identity" 
  | "custom";

export type Room = {
  id: string;
  name: string;
  description: string;
  category: RoomCategory;
  members: number;
  tags: string[];
};

interface RoomSelectorProps {
  username: string;
  onJoinRoom: (roomId: string) => void;
}

// Room data (in a real app, this would come from an API)
const PREDEFINED_ROOMS: Room[] = [
  {
    id: "nyc",
    name: "New York City",
    description: "Chat with locals in NYC about community issues and events",
    category: "location",
    members: 128,
    tags: ["location", "urban"]
  },
  {
    id: "sf",
    name: "San Francisco",
    description: "The SF Bay Area community chat room",
    category: "location",
    members: 87,
    tags: ["location", "tech"]
  },
  {
    id: "chicago",
    name: "Chicago",
    description: "Windy City residents discussing local matters",
    category: "location",
    members: 72,
    tags: ["location", "midwest"]
  },
  {
    id: "18-25",
    name: "Young Adults (18-25)",
    description: "Connect with others in their early twenties",
    category: "age",
    members: 156,
    tags: ["age", "youth"]
  },
  {
    id: "25-35",
    name: "Millennials (25-35)",
    description: "Chat with other millennials about shared experiences",
    category: "age",
    members: 203,
    tags: ["age", "millennials"]
  },
  {
    id: "35-50",
    name: "Gen X (35-50)",
    description: "Generation X discussion forum",
    category: "age",
    members: 92,
    tags: ["age", "genx"]
  },
  {
    id: "tech",
    name: "Technology",
    description: "Discuss tech trends, gadgets, and innovation",
    category: "interest",
    members: 249,
    tags: ["interest", "technology"]
  },
  {
    id: "music",
    name: "Music Lovers",
    description: "Share music recommendations and discuss concerts",
    category: "interest",
    members: 168,
    tags: ["interest", "music"]
  },
  {
    id: "fitness",
    name: "Fitness & Health",
    description: "Exercise tips, wellness discussions and motivation",
    category: "interest",
    members: 142,
    tags: ["interest", "fitness"]
  },
  {
    id: "lgbtq",
    name: "LGBTQ+ Community",
    description: "A safe space for the LGBTQ+ community",
    category: "identity",
    members: 95,
    tags: ["identity", "lgbtq"]
  },
  {
    id: "parents",
    name: "Parents Chat",
    description: "Connect with other parents and share experiences",
    category: "identity",
    members: 117,
    tags: ["identity", "parents"]
  },
  {
    id: "coffee",
    name: "Coffee Enthusiasts",
    description: "For those who love the perfect brew",
    category: "interest",
    members: 83,
    tags: ["interest", "coffee"]
  }
];

// Category icon mapping
const getCategoryIcon = (category: RoomCategory): LucideIcon => {
  switch (category) {
    case "location": return MapPin;
    case "age": return Users;
    case "interest": return BookOpen;
    case "identity": return Heart;
    case "custom": return Smile;
    default: return Locate;
  }
};

export default function RoomSelector({ username, onJoinRoom }: RoomSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customRoomName, setCustomRoomName] = useState("");
  const [customRoomDescription, setCustomRoomDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Filter rooms based on search query and category
  const filteredRooms = PREDEFINED_ROOMS.filter(room => {
    const matchesSearch = 
      searchQuery === "" || 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = 
      !selectedCategory || 
      selectedCategory === "all" || 
      room.category === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });
  
  // Category tabs for browsing
  const categories = [
    { id: "all", label: "All Rooms" },
    { id: "location", label: "Location" },
    { id: "age", label: "Age Group" },
    { id: "interest", label: "Interests" },
    { id: "identity", label: "Identity" }
  ];
  
  const handleJoinRoom = (roomId: string) => {
    onJoinRoom(roomId);
  };
  
  const handleCreateRoom = () => {
    // In a real app, this would create a custom room and then join it
    if (customRoomName.trim()) {
      alert(`Custom room "${customRoomName}" created! (This would create a real room in a production app)`);
      setCustomRoomName("");
      setCustomRoomDescription("");
      setIsPrivate(false);
    }
  };

  // Get icon for room card
  const getRoomIcon = (room: Room) => {
    if (room.category === "location") return <MapPin className="h-5 w-5 text-primary" />;
    if (room.category === "age") return <Users className="h-5 w-5 text-primary" />;
    if (room.category === "interest") {
      if (room.tags.includes("music")) return <Music className="h-5 w-5 text-primary" />;
      if (room.tags.includes("fitness")) return <Dumbbell className="h-5 w-5 text-primary" />;
      if (room.tags.includes("coffee")) return <Coffee className="h-5 w-5 text-primary" />;
      if (room.tags.includes("technology")) return <Code className="h-5 w-5 text-primary" />;
      return <BookOpen className="h-5 w-5 text-primary" />;
    }
    if (room.category === "identity") return <Heart className="h-5 w-5 text-primary" />;
    return <Smile className="h-5 w-5 text-primary" />;
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden" style={{ maxHeight: '460px' }}>
      <div className="p-3 border-b bg-[hsl(var(--card))]">
        <h3 className="text-base font-medium">Chat Rooms</h3>
        <p className="text-xs text-muted-foreground">
          Join a room or create your own to chat with others
        </p>
      </div>
      
      <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <div className="px-3 pt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Rooms</TabsTrigger>
            <TabsTrigger value="create">Create Room</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="browse" className="flex-grow px-3 pt-2 pb-3 overflow-hidden flex flex-col">
          <div className="mb-3 flex items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="ml-2">
              <Select value={selectedCategory || "all"} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex-grow overflow-auto pr-1">
            {filteredRooms.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No rooms found matching your criteria
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRooms.map(room => (
                  <Card key={room.id} className="p-2 hover:bg-muted/30 transition-colors">
                    <div className="flex">
                      <div className="mr-3 mt-1">
                        {getRoomIcon(room)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{room.name}</h4>
                          <span className="text-xs text-muted-foreground">{room.members} active</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                          {room.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {room.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-6 text-xs"
                            onClick={() => handleJoinRoom(room.id)}
                          >
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="flex-grow px-3 pt-2 pb-3 overflow-auto">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="room-name" className="text-sm">Room Name</Label>
              <Input
                id="room-name"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                placeholder="Enter a name for your room"
                className="h-8"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="room-description" className="text-sm">Description</Label>
              <Input
                id="room-description"
                value={customRoomDescription}
                onChange={(e) => setCustomRoomDescription(e.target.value)}
                placeholder="What is this room about?"
                className="h-8"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="room-category" className="text-sm">Category</Label>
              <Select defaultValue="custom">
                <SelectTrigger id="room-category" className="h-8">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="age">Age Group</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="identity">Identity</SelectItem>
                  <SelectItem value="custom">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="private-room" 
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="private-room" className="text-sm">Private Room (invite only)</Label>
            </div>
            
            <Button 
              onClick={handleCreateRoom}
              disabled={!customRoomName.trim()}
              className="w-full"
            >
              Create Room
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}