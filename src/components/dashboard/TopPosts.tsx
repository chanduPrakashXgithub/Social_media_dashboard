
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";
import { useTopPosts } from "@/hooks/useTopPosts";
import { Skeleton } from "@/components/ui/skeleton";

const TopPosts = () => {
  const { data: topPosts, isLoading } = useTopPosts();

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      twitter: "bg-blue-500",
      linkedin: "bg-blue-700",
      instagram: "bg-pink-500",
      youtube: "bg-red-500",
      facebook: "bg-blue-600",
      tiktok: "bg-black"
    };
    return colors[platform.toLowerCase()] || "bg-gray-500";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
            Top Performing Posts
          </CardTitle>
          <CardDescription>
            Your best content from the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border bg-white/50">
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
          Top Performing Posts
        </CardTitle>
        <CardDescription>
          Your best content from the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPosts && topPosts.length > 0 ? (
          topPosts.map((post) => (
            <div key={post.id} className="p-4 rounded-lg border bg-white/50 hover:bg-white/70 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.social_accounts.platform)} mt-2`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {post.social_accounts.platform}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(post.posted_at)}</span>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{post.content?.substring(0, 120)}...</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {post.shares_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">{post.engagement_rate?.toFixed(1) || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No posts found. Connect your social media accounts to see your top performing content.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { TopPosts };
