
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Zap } from "lucide-react";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import { useAIInsights } from "@/hooks/useAIInsights";
import { Skeleton } from "@/components/ui/skeleton";

const PostingSchedule = () => {
  const { data: scheduledPosts, isLoading: isLoadingPosts } = useScheduledPosts();
  const { data: aiInsights, isLoading: isLoadingInsights } = useAIInsights();

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  };

  // Best posting times based on AI insights
  const bestTimes = [
    { platform: "Twitter", time: "2:00 PM - 4:00 PM", days: "Mon-Fri" },
    { platform: "LinkedIn", time: "9:00 AM - 11:00 AM", days: "Tue-Thu" },
    { platform: "Instagram", time: "6:00 PM - 8:00 PM", days: "Wed-Sun" }
  ];

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            Content Calendar
          </div>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-3 w-3" />
            Add Post
          </Button>
        </CardTitle>
        <CardDescription>
          Scheduled posts and AI recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scheduled Posts */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Upcoming Posts</h4>
          {isLoadingPosts ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border bg-white/50 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))
          ) : scheduledPosts && scheduledPosts.length > 0 ? (
            scheduledPosts.map((post) => (
              <div key={post.id} className="p-3 rounded-lg border bg-white/50 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={post.status === "scheduled" ? "default" : "secondary"} className="text-xs">
                    {post.social_accounts.platform}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {post.ai_generated && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Zap className="h-2 w-2" />
                        AI
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatScheduledTime(post.scheduled_for)}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed">{post.content.substring(0, 100)}...</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No scheduled posts. Create your first scheduled post!
            </div>
          )}
        </div>

        {/* Best Posting Times */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            AI Recommended Times
          </h4>
          <div className="space-y-2">
            {bestTimes.map((time, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="font-medium">{time.platform}</span>
                <div className="text-muted-foreground">
                  {time.time} • {time.days}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { PostingSchedule };
