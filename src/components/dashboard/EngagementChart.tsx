
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

const EngagementChart = () => {
  const data = [
    { name: "Jan", engagement: 3.2, reach: 45000, impressions: 67000 },
    { name: "Feb", engagement: 3.8, reach: 52000, impressions: 73000 },
    { name: "Mar", engagement: 4.1, reach: 48000, impressions: 69000 },
    { name: "Apr", engagement: 3.9, reach: 61000, impressions: 85000 },
    { name: "May", engagement: 4.5, reach: 67000, impressions: 92000 },
    { name: "Jun", engagement: 4.2, reach: 71000, impressions: 98000 },
    { name: "Jul", engagement: 4.8, reach: 78000, impressions: 105000 }
  ];

  const chartConfig = {
    engagement: {
      label: "Engagement Rate",
      color: "hsl(var(--primary))",
    },
    reach: {
      label: "Reach",
      color: "hsl(var(--secondary))",
    },
    impressions: {
      label: "Impressions",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          Engagement Trends
        </CardTitle>
        <CardDescription>
          Track your engagement performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorEngagement)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { EngagementChart };
