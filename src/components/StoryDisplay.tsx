import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Download, ArrowLeft, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroStoryExample from "@/assets/hero-story-example.jpg";

interface StoryDisplayProps {
  story: string;
  prompt: string;
  onBack: () => void;
  onSaveToLibrary: (story: string, prompt: string) => void;
}

export const StoryDisplay = ({ story, prompt, onBack, onSaveToLibrary }: StoryDisplayProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My One-Minute Story",
          text: story,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(story);
      toast({
        title: "Copied to clipboard!",
        description: "Your story is ready to share anywhere.",
      });
    }
  };

  const handleSave = () => {
    onSaveToLibrary(story, prompt);
    toast({
      title: "Saved to library! 📚",
      description: "You can find this story in your personal collection.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download feature coming soon!",
      description: "Export as image, comic, or video with AI integration.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Create
        </Button>
        
        <Badge variant="secondary" className="px-4 py-2">
          <BookOpen className="h-4 w-4 mr-2" />
          Story Complete
        </Badge>
      </div>

      <Card className="overflow-hidden border-0 shadow-magical">
        {/* Story Image */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={heroStoryExample}
            alt="Generated story illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <Badge className="gradient-primary text-white border-0 mb-2">
              From: "{prompt}"
            </Badge>
          </div>
        </div>

        {/* Story Content */}
        <div className="p-8 gradient-card">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-foreground font-medium">
              {story}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border/50">
            <Button
              onClick={handleSave}
              variant="magic"
              className="flex-1 min-w-[140px]"
            >
              <Heart className="h-5 w-5 mr-2" />
              Save to Library
            </Button>
            
            <Button
              onClick={handleShare}
              variant="creative"
              className="flex-1 min-w-[140px]"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Story
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 min-w-[140px] border-primary/30 hover:bg-primary/10"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};