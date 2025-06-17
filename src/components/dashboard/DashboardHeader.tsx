
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Download, LogOut, Settings, User } from 'lucide-react';
import { SchedulePostModal } from "./SchedulePostModal";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import { toast } from "@/components/ui/use-toast";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: scheduledPosts } = useScheduledPosts();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // CSV Export functionality (can also include analytics if needed)
  const handleExport = () => {
    if (!scheduledPosts || scheduledPosts.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }
    const headers = ["Platform", "Account", "Content", "Scheduled For", "Status"];
    const csvRows = [
      headers.join(","),
      ...scheduledPosts.map((post: any) =>
        [
          post.social_accounts?.platform ?? "",
          post.social_accounts?.account_name ?? "",
          `"${(post.content || "").replace(/"/g, '""')}"`,
          post.scheduled_for,
          post.status
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scheduled_posts.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "Your CSV report was downloaded." });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Social Media Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          AI-powered insights for your social media performance
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setModalOpen(true)}
        >
          <Calendar className="h-4 w-4" />
          Schedule Post
        </Button>
        <SchedulePostModal open={modalOpen} onOpenChange={setModalOpen} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.first_name && user?.user_metadata?.last_name
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                    : 'User'
                  }
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
