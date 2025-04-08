import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import type { Issue, Category } from "@shared/schema";

// Define custom marker icon
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

interface IssueMapProps {
  issues: Issue[];
  categories: Category[];
  selectedCategoryId?: string;
}

/**
 * Parse a string location in the format "latitude,longitude" to [lat, lng]
 */
const parseLocation = (locationStr: string | null): [number, number] | null => {
  if (!locationStr) return null;
  
  const parts = locationStr.split(',').map(part => parseFloat(part.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return null;
};

const IssueMap = ({ issues, categories, selectedCategoryId }: IssueMapProps) => {
  const mapRef = useRef<any>(null);
  
  // Filter issues by location and selected category
  const filteredIssues = issues.filter(issue => {
    const hasLocation = issue.location && parseLocation(issue.location);
    const matchesCategory = !selectedCategoryId || selectedCategoryId === "all" || 
                            issue.categoryId === parseInt(selectedCategoryId);
    return hasLocation && matchesCategory;
  });
  
  // Determine center and zoom level
  const defaultCenter: [number, number] = [39.8283, -98.5795]; // Center of the US
  const defaultZoom = 4;
  
  useEffect(() => {
    // If there are filtered issues with locations, fit the map to include all markers
    if (mapRef.current && filteredIssues.length > 0) {
      const map = mapRef.current;
      
      // If there's only one issue, center on it
      if (filteredIssues.length === 1) {
        const location = parseLocation(filteredIssues[0].location);
        if (location) {
          map.setView(location, 10);
        }
      } else if (filteredIssues.length > 1) {
        // If there are multiple issues, create bounds to fit all markers
        try {
          const bounds = filteredIssues
            .map(issue => parseLocation(issue.location))
            .filter((loc): loc is [number, number] => loc !== null)
            .map(([lat, lng]) => [lat, lng]);
          
          if (bounds.length > 0) {
            map.fitBounds(bounds);
          }
        } catch (error) {
          console.error("Error adjusting map bounds:", error);
        }
      }
    }
  }, [filteredIssues]);
  
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {filteredIssues.map(issue => {
        const location = parseLocation(issue.location);
        const category = categories.find(cat => cat.id === issue.categoryId);
        
        if (location) {
          return (
            <Marker 
              key={issue.id} 
              position={location}
              icon={customIcon}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-bold text-base">{issue.title}</h3>
                  <div className="flex items-center gap-1 text-xs mt-1 mb-2">
                    <span className="bg-[hsl(var(--secondary)/30)] px-2 py-0.5 rounded-full">
                      {category?.name || "Uncategorized"}
                    </span>
                    <span className="text-[hsl(var(--foreground)/70)]">
                      • {issue.votes} votes
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--foreground)/80)] max-h-24 overflow-y-auto">
                    {issue.description.length > 100 
                      ? `${issue.description.substring(0, 100)}...` 
                      : issue.description}
                  </p>
                  <div className="mt-2 flex justify-end">
                    <a 
                      href={`/issues/${issue.id}`} 
                      className="text-xs text-[hsl(var(--space-blue))] hover:underline"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};

export default IssueMap;