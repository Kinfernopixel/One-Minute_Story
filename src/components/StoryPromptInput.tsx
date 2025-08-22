import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIService, StoryGenerationResult } from "@/lib/ai-service";

interface StoryPromptInputProps {
  onStoryGenerated: (story: string, prompt: string, imageUrl?: string) => void;
}

export const StoryPromptInput = ({ onStoryGenerated }: StoryPromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Story prompt needed",
        description: "Please enter your creative idea first!",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate story and image using real AI APIs
      const result: StoryGenerationResult = await AIService.generateStory(prompt);
      
      if (result.error) {
        toast({
          title: "Generation failed",
          description: result.error,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      if (result.story) {
        onStoryGenerated(result.story, prompt, result.imageUrl);
        setPrompt("");
        
        toast({
          title: "Story created! ✨",
          description: "Your AI-generated story and image are ready!",
        });
      }
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Generation failed",
        description: "Something went wrong while creating your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice input coming soon!",
      description: "This feature will be available with AI integration.",
    });
  };

  const placeholderPrompts = [
    "A penguin opens a bakery in Paris",
    "Dragons discover they love knitting",
    "A library where books write themselves",
    "Clouds that taste like different desserts",
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="p-8 gradient-card border-0 shadow-card">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 gradient-primary rounded-full shadow-magical">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              What's today's story idea?
            </h2>
            <p className="text-muted-foreground">
              Share your creative spark and watch it bloom into a magical tale
            </p>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Type your story idea here... (e.g., A dragon who's afraid of flying)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-lg resize-none border-2 border-border/50 focus:border-primary transition-colors"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-3 right-3 hover:bg-primary/10"
              onClick={handleVoiceInput}
            >
              <Mic className="h-5 w-5 text-primary" />
            </Button>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            variant="hero"
            size="xl"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2">
                  <Wand2 className="h-6 w-6" />
                </div>
                Creating your story...
              </>
            ) : (
              <>
                <Wand2 className="h-6 w-6 mr-2" />
                Create My Story
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground font-medium">Need inspiration? Try these:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {placeholderPrompts.map((example, index) => (
            <Button
              key={index}
              variant="creative"
              size="sm"
              onClick={() => setPrompt(example)}
              className="text-sm"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};