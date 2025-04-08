import React, { useState } from 'react';
import { useTags } from '@/hooks/use-tags';
import { Tag } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Tag as TagIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import TagBadge from './TagBadge';

interface TagBrowserProps {
  onTagSelect?: (tag: Tag) => void;
  selectedTagId?: number | null;
}

export function TagBrowser({ onTagSelect, selectedTagId }: TagBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { tags, isLoadingTags } = useTags();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await fetch(`/api/tags?search=${encodeURIComponent(query)}`)
        .then(r => r.json());
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching tags:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const displayedTags = searchQuery.length >= 2 ? searchResults : tags;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      {selectedTagId && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onTagSelect && onTagSelect(null as any)}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          Clear filter
        </Button>
      )}
      
      {isLoadingTags || isSearching ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayedTags.length > 0 ? (
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-1">
            {displayedTags.map((tag) => (
              <div 
                key={tag.id}
                className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-colors ${
                  selectedTagId === tag.id 
                    ? 'bg-primary/10 hover:bg-primary/15' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onTagSelect && onTagSelect(tag)}
              >
                <TagBadge tag={tag} interactive={false} />
                <span className="text-xs text-muted-foreground">
                  {/* You could add issue count here if available */}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <TagIcon className="h-12 w-12 mx-auto opacity-20 mb-2" />
          <p>No tags found</p>
          <p className="text-xs mt-1">
            {searchQuery.length >= 2 
              ? 'Try a different search term' 
              : 'Tags will appear here as they are created'}
          </p>
        </div>
      )}
    </div>
  );
}

export default TagBrowser;