
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { supabase } from "@/integrations/supabase/client";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";

interface SchedulePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ open, onOpenChange }) => {
  const { data: socialAccounts, isLoading } = useSocialAccounts();
  const [accountId, setAccountId] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { refetch } = useScheduledPosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId || !content || !date || !time) {
      toast({ title: "All fields are required.", variant: "destructive" });
      return;
    }
    const scheduledFor = new Date(`${date}T${time}`).toISOString();
    setLoading(true);
    const { error } = await supabase.from("scheduled_posts").insert([
      { 
        account_id: accountId,
        content,
        scheduled_for: scheduledFor,
        status: "scheduled",
        user_id: socialAccounts?.[0]?.user_id, // assuming same user for simplicity
      }
    ]);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to schedule post", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post scheduled!" });
      refetch();
      setContent("");
      setDate("");
      setTime("");
      setAccountId("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Schedule Post
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1 font-medium text-white">Social Account</label>
            <select
              className="w-full p-2 rounded bg-[#241533] text-white border border-[#833AB4]"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              <option value="">Select</option>
              {socialAccounts?.map((acc: any) => (
                <option key={acc.id} value={acc.id}>{acc.platform} &mdash; {acc.account_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-white">Content</label>
            <Textarea
              className="bg-[#241533] text-white border-[#833AB4]"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              required
              maxLength={280}
              placeholder="Your post content..."
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-white">Date</label>
              <Input
                type="date"
                className="bg-[#241533] text-white border-[#833AB4]"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-white">Time</label>
              <Input
                type="time"
                className="bg-[#241533] text-white border-[#833AB4]"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-[#833AB4] to-[#43156B] text-white" 
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
