import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { TopPosts } from "@/components/dashboard/TopPosts";
import { SentimentAnalysis } from "@/components/dashboard/SentimentAnalysis";
import { PostingSchedule } from "@/components/dashboard/PostingSchedule";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { Skeleton } from "@/components/ui/skeleton";
import ConnectTwitterButton from "@/components/dashboard/ConnectTwitterButton";
import ConnectLinkedInButton from "@/components/dashboard/ConnectLinkedInButton";
import ConnectInstagramButton from "@/components/dashboard/ConnectInstagramButton";
import { useAuth } from "@/hooks/useAuth";

// Custom background gradient using #833AB4 (purple) and dark shades
const DASHBOARD_BG_GRADIENT =
  "bg-gradient-to-br from-[#18121D] via-[#1f1b29] to-[#833AB4] min-h-screen";

const DARK_CARD_BG = "bg-[#241533]/80 backdrop-blur"; // semi-transparent dark card
const DARK_CARD_BG_SOLID = "bg-[#241533]"; // for solid bg if needed
const CARD_TEXT = "text-white";

// Accent gradient, also using #833AB4 and deep blues
const PURPLE_GRADIENT = "bg-gradient-to-r from-[#833AB4] to-[#43156B]";

// Platform color changes for badges, keep as-is or tweak to fit dark mode/purple if desired

const Dashboard = () => {
  const { data: socialAccounts, isLoading } = useSocialAccounts();
  const { user } = useAuth();

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      twitter: "bg-blue-400",
      linkedin: "bg-[#833AB4]",
      instagram: "bg-pink-500",
      youtube: "bg-red-500",
      facebook: "bg-blue-600",
      tiktok: "bg-black"
    };
    return colors[platform.toLowerCase()] || "bg-gray-500";
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className={`${DASHBOARD_BG_GRADIENT} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-2">
          <DashboardHeader />
        </div>

        {/* Platform Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className={`${DARK_CARD_BG} border-0`}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-5 w-16" />
                </CardContent>
              </Card>
            ))
          ) : socialAccounts && socialAccounts.length > 0 ? (
            socialAccounts.map((account) => (
              <Card key={account.id} className={`${DARK_CARD_BG} hover:shadow-lg transition-all duration-300 border-0`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-sm font-medium capitalize ${CARD_TEXT}`}>{account.platform}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getPlatformColor(account.platform)}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${CARD_TEXT}`}>{formatFollowers(account.followers_count || 0)}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">+5.2%</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs bg-[#833AB4]/90 border-none text-white">Connected</Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className={`col-span-full ${DARK_CARD_BG} border-0`}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className={`text-lg font-semibold mb-2 ${CARD_TEXT}`}>No Social Accounts Connected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect your social media accounts to start tracking analytics and insights.
                </p>
                <div className="flex flex-col w-full max-w-xs gap-2">
                  <ConnectTwitterButton />
                  <ConnectLinkedInButton />
                  <ConnectInstagramButton />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Metrics Overview */}
        <div className="">
          <MetricsOverview />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Chart */}
          <div className="lg:col-span-2">
            <EngagementChart />
          </div>
          {/* Sentiment Analysis */}
          <div>
            <SentimentAnalysis />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPosts />
          <PostingSchedule />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
