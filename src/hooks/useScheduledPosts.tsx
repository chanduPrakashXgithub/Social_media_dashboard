
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useScheduledPosts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scheduled-posts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select(`
          *,
          social_accounts!inner(
            platform,
            account_name
          )
        `)
        .eq('user_id', user.id)
        .gte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
