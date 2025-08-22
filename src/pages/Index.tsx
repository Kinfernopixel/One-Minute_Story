import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StoryPromptInput } from "@/components/StoryPromptInput";
import { StoryDisplay } from "@/components/StoryDisplay";
import { StoryLibrary } from "@/components/StoryLibrary";
import creativeBg from "@/assets/creative-bg.jpg";

type NavigationTab = "create" | "library";

interface Story {
  id: string;
  story: string;
  prompt: string;
  createdAt: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>("create");
  const [currentStory, setCurrentStory] = useState<{ story: string; prompt: string } | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

  const handleStoryGenerated = (story: string, prompt: string) => {
    setCurrentStory({ story, prompt });
  };

  const handleBackToCreate = () => {
    setCurrentStory(null);
  };

  const handleSaveToLibrary = (story: string, prompt: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      story,
      prompt,
      createdAt: new Date(),
    };
    setStories(prev => [newStory, ...prev]);
  };

  const handleViewStory = (story: Story) => {
    setCurrentStory({ story: story.story, prompt: story.prompt });
    setActiveTab("create");
  };

  const handleDeleteStory = (id: string) => {
    setStories(prev => prev.filter(story => story.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url(${creativeBg})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          storyCount={stories.length}
        />
        
        <main className="container mx-auto px-4 py-8">
          {activeTab === "create" && (
            <div className="space-y-8">
              {currentStory ? (
                <StoryDisplay
                  story={currentStory.story}
                  prompt={currentStory.prompt}
                  onBack={handleBackToCreate}
                  onSaveToLibrary={handleSaveToLibrary}
                />
              ) : (
                <div className="space-y-12">
                  <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-float">
                      One-Minute Story
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Turn your creative spark into an illustrated story in seconds
                    </p>
                  </div>
                  
                  <StoryPromptInput onStoryGenerated={handleStoryGenerated} />
                </div>
              )}
            </div>
          )}
          
          {activeTab === "library" && (
            <StoryLibrary
              stories={stories}
              onViewStory={handleViewStory}
              onDeleteStory={handleDeleteStory}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
