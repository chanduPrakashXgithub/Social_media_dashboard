
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Brain, Calendar, Zap, TrendingUp, Users, MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18121D] via-[#1f1b29] to-[#833AB4]">
      {/* Header */}
      <header className="border-b border-[#833AB4]/20 bg-[#241533]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#833AB4] to-[#43156B] rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#833AB4] to-[#E1306C] bg-clip-text text-transparent">
              TrendAI Hub
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-[#833AB4] to-[#43156B] hover:from-[#9d4edd] hover:to-[#5a189a] text-white">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:bg-[#833AB4]/20">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-[#833AB4] to-[#43156B] hover:from-[#9d4edd] hover:to-[#5a189a] text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-6 bg-[#833AB4]/20 border-[#833AB4]/30 text-white">
          <Zap className="h-3 w-3 mr-1" />
          AI-Powered Analytics
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#833AB4] to-[#E1306C] bg-clip-text text-transparent">
          Master Your Social Media
          <br />
          with AI Insights
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Transform your social media strategy with intelligent analytics, automated scheduling, 
          and AI-powered content recommendations that drive real engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-[#833AB4] to-[#43156B] hover:from-[#9d4edd] hover:to-[#5a189a] text-white gap-2">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-[#833AB4] text-white hover:bg-[#833AB4]/20">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-300">
            Comprehensive tools for social media management and growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI-Powered Analytics",
              description: "Get intelligent insights about your audience behavior, content performance, and optimal posting times.",
              color: "text-[#833AB4]"
            },
            {
              icon: Calendar,
              title: "Smart Scheduling",
              description: "Schedule posts across all platforms with AI-recommended timing for maximum engagement.",
              color: "text-[#E1306C]"
            },
            {
              icon: TrendingUp,
              title: "Performance Tracking",
              description: "Monitor your growth with detailed analytics and automated reporting across all platforms.",
              color: "text-[#F56040]"
            },
            {
              icon: Users,
              title: "Audience Insights",
              description: "Understand your audience demographics, interests, and engagement patterns.",
              color: "text-[#FFDC80]"
            },
            {
              icon: MessageCircle,
              title: "Sentiment Analysis",
              description: "Track how your audience feels about your content with real-time sentiment monitoring.",
              color: "text-[#833AB4]"
            },
            {
              icon: Eye,
              title: "Competitor Analysis",
              description: "Stay ahead with insights into your competitors' strategies and performance.",
              color: "text-[#E1306C]"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-0 bg-[#241533]/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:bg-[#241533]/90">
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Card className="border-0 bg-gradient-to-r from-[#833AB4] to-[#43156B] text-white">
          <CardContent className="p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to supercharge your social media?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators and businesses using AI to grow their social presence.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-[#833AB4] hover:bg-gray-100">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
