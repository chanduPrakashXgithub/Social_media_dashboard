
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye } from "lucide-react";
import { useAnalyticsMetrics } from "@/hooks/useAnalyticsMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const MetricsOverview = () => {
  const { data: metrics, isLoading } = useAnalyticsMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate aggregated metrics from data
  const totalReach = metrics?.reduce((sum, m) => sum + (m.reach || 0), 0) || 0;
  const totalLikes = metrics?.reduce((sum, m) => sum + (m.likes || 0), 0) || 0;
  const totalComments = metrics?.reduce((sum, m) => sum + (m.comments || 0), 0) || 0;
  const totalShares = metrics?.reduce((sum, m) => sum + (m.shares || 0), 0) || 0;
  const totalFollowers = metrics?.reduce((sum, m) => sum + (m.followers_gained || 0), 0) || 0;
  const avgEngagement = metrics?.length ? 
    metrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0) / metrics.length : 0;

  const metricsData = [
    {
      title: "Total Reach",
      value: totalReach > 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString(),
      change: "+12.5%", // You could calculate this from historical data
      trend: "up",
      icon: Eye,
      description: "People reached this month"
    },
    {
      title: "Engagement Rate",
      value: `${avgEngagement.toFixed(1)}%`,
      change: "+0.8%",
      trend: "up",
      icon: Heart,
      description: "Average engagement"
    },
    {
      title: "New Followers",
      value: totalFollowers.toString(),
      change: "+23.1%",
      trend: "up",
      icon: Users,
      description: "This month"
    },
    {
      title: "Comments",
      value: totalComments > 1000 ? `${(totalComments / 1000).toFixed(1)}K` : totalComments.toString(),
      change: "-5.2%",
      trend: "down",
      icon: MessageCircle,
      description: "Total comments"
    },
    {
      title: "Shares",
      value: totalShares.toString(),
      change: "+18.7%",
      trend: "up",
      icon: Share2,
      description: "Content shared"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metricsData.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor = metric.trend === "up" ? "text-green-500" : "text-red-500";
        
        return (
          <Card key={metric.title} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{metric.change}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export { MetricsOverview };
