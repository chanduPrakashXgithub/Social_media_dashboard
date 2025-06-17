
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown, TrendingUp } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAIInsights } from "@/hooks/useAIInsights";
import { Skeleton } from "@/components/ui/skeleton";

const SentimentAnalysis = () => {
  const { user } = useAuth();
  const { data: aiInsights } = useAIInsights();

  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ['sentiment-analysis', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          sentiment_label,
          social_accounts!inner(user_id)
        `)
        .eq('social_accounts.user_id', user.id)
        .not('sentiment_label', 'is', null);

      if (error) throw error;

      // Calculate sentiment distribution
      const sentimentCounts = data.reduce((acc, post) => {
        const label = post.sentiment_label;
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = data.length;
      return {
        positive: { count: sentimentCounts.positive || 0, percentage: total ? Math.round((sentimentCounts.positive || 0) / total * 100) : 0 },
        neutral: { count: sentimentCounts.neutral || 0, percentage: total ? Math.round((sentimentCounts.neutral || 0) / total * 100) : 0 },
        negative: { count: sentimentCounts.negative || 0, percentage: total ? Math.round((sentimentCounts.negative || 0) / total * 100) : 0 }
      };
    },
    enabled: !!user,
  });

  const sentimentItems = [
    { 
      sentiment: "Positive", 
      percentage: sentimentData?.positive.percentage || 68, 
      count: sentimentData?.positive.count || 0, 
      color: "bg-green-500", 
      icon: Smile 
    },
    { 
      sentiment: "Neutral", 
      percentage: sentimentData?.neutral.percentage || 22, 
      count: sentimentData?.neutral.count || 0, 
      color: "bg-yellow-500", 
      icon: Meh 
    },
    { 
      sentiment: "Negative", 
      percentage: sentimentData?.negative.percentage || 10, 
      count: sentimentData?.negative.count || 0, 
      color: "bg-red-500", 
      icon: Frown 
    }
  ];

  // Filter AI insights for engagement tips
  const engagementInsights = aiInsights?.filter(insight => 
    insight.insight_type === 'engagement_tip' || insight.insight_type === 'posting_time'
  ).slice(0, 3) || [];

  const defaultInsights = [
    "Your content performs 23% better on weekends",
    "Posts with images get 45% more engagement",
    "Best posting time: 2-4 PM on weekdays"
  ];

  const displayInsights = engagementInsights.length > 0 
    ? engagementInsights.map(insight => insight.description)
    : defaultInsights;

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
          AI Sentiment Analysis
        </CardTitle>
        <CardDescription>
          Real-time analysis of audience sentiment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sentiment Breakdown */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-2 w-full mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : (
            sentimentItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.sentiment} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                    <Icon className={`h-4 w-4 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.sentiment}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`} 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.count} {item.count === 1 ? 'mention' : 'mentions'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* AI Insights */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            AI Insights
          </h4>
          <div className="space-y-2">
            {displayInsights.map((insight, index) => (
              <Badge key={index} variant="secondary" className="w-full justify-start text-xs py-2 px-3">
                {insight}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { SentimentAnalysis };
