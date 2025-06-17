
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTopPosts = (limit = 5) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['top-posts', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          social_accounts!inner(
            user_id,
            platform,
            account_name
          )
        `)
        .eq('social_accounts.user_id', user.id)
        .gte('posted_at', sevenDaysAgo.toISOString())
        .order('engagement_rate', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
