
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useAnalyticsMetrics = (dateRange = 30) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analytics-metrics', user?.id, dateRange],
    queryFn: async () => {
      if (!user) return [];
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - dateRange);

      const { data, error } = await supabase
        .from('analytics_metrics')
        .select(`
          *,
          social_accounts!inner(
            user_id,
            platform,
            account_name
          )
        `)
        .eq('social_accounts.user_id', user.id)
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .lte('metric_date', endDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
