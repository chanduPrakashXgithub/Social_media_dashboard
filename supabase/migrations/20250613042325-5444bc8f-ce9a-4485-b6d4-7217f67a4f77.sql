
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social media accounts table
CREATE TABLE public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'youtube', 'facebook', 'tiktok')),
  account_name TEXT NOT NULL,
  account_handle TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics metrics table
CREATE TABLE public.analytics_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.social_accounts NOT NULL,
  metric_date DATE NOT NULL,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  followers_gained INTEGER DEFAULT 0,
  followers_lost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.social_accounts NOT NULL,
  platform_post_id TEXT NOT NULL,
  content TEXT,
  post_type TEXT CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'story')),
  media_urls TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  sentiment_score DECIMAL(3,2), -- -1 to 1 scale
  sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled posts table
CREATE TABLE public.scheduled_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES public.social_accounts NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'draft')),
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI insights table
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('posting_time', 'content_suggestion', 'engagement_tip', 'trend_analysis')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0 to 1 scale
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for social_accounts
CREATE POLICY "Users can view their own social accounts" ON public.social_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own social accounts" ON public.social_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for analytics_metrics
CREATE POLICY "Users can view metrics for their accounts" ON public.analytics_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.social_accounts 
      WHERE social_accounts.id = analytics_metrics.account_id 
      AND social_accounts.user_id = auth.uid()
    )
  );

-- Create RLS policies for posts
CREATE POLICY "Users can view posts for their accounts" ON public.posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.social_accounts 
      WHERE social_accounts.id = posts.account_id 
      AND social_accounts.user_id = auth.uid()
    )
  );

-- Create RLS policies for scheduled_posts
CREATE POLICY "Users can manage their own scheduled posts" ON public.scheduled_posts
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for ai_insights
CREATE POLICY "Users can view their own AI insights" ON public.ai_insights
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX idx_analytics_metrics_account_id ON public.analytics_metrics(account_id);
CREATE INDEX idx_analytics_metrics_date ON public.analytics_metrics(metric_date);
CREATE INDEX idx_posts_account_id ON public.posts(account_id);
CREATE INDEX idx_posts_posted_at ON public.posts(posted_at);
CREATE INDEX idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_scheduled_for ON public.scheduled_posts(scheduled_for);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
