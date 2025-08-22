import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Library, Trash2, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id: string;
  story: string;
  prompt: string;
  createdAt: Date;
}

interface StoryLibraryProps {
  stories: Story[];
  onViewStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
}

export const StoryLibrary = ({ stories, onViewStory, onDeleteStory }: StoryLibraryProps) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    onDeleteStory(id);
    toast({
      title: "Story deleted",
      description: "The story has been removed from your library.",
    });
  };

  if (stories.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <Card className="p-12 gradient-card border-0 shadow-card">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 gradient-primary rounded-full shadow-magical opacity-60">
                <Library className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Your Story Library</h3>
            <p className="text-muted-foreground text-lg">
              Create your first story to start building your personal collection of magical tales.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Story Library
        </h2>
        <p className="text-muted-foreground">
          {stories.length} magical {stories.length === 1 ? 'story' : 'stories'} in your collection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden border-0 shadow-card hover:shadow-magical transition-shadow duration-300">
            <div className="gradient-card p-6 space-y-4">
              <div className="space-y-3">
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {story.createdAt.toLocaleDateString()}
                </Badge>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground line-clamp-2">
                    "{story.prompt}"
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {story.story}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border/30">
                <Button
                  onClick={() => onViewStory(story)}
                  variant="magic"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                
                <Button
                  onClick={() => handleDelete(story.id)}
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};