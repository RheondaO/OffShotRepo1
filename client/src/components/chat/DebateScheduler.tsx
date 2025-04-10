
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

export interface DebateProps {
  topic: string;
  scheduledFor: Date;
  location?: string;
  participants: string[];
}

export function DebateScheduler() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState("");

  const handleSchedule = async () => {
    if (!topic || !date) return;
    
    try {
      const response = await fetch('/api/debates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic,
          scheduledFor: date,
          location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule debate');
      }

      // Clear form
      setTopic('');
      setDate(undefined);
      setLocation('');
      
    } catch (error) {
      console.error('Error scheduling debate:', error);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Schedule a Debate</h3>
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Debate topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <Button 
          onClick={handleSchedule}
          disabled={!topic || !date}
        >
          Schedule Debate
        </Button>
      </div>
    </Card>
  );
}
