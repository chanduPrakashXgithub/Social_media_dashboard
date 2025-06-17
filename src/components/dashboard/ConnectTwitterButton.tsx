
import React from "react";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";

/**
 * This button now simply redirects to Twitter's login/authorization page.
 * Note: For full OAuth flow (with analytics data or posting) a backend is required.
 * This just demonstrates a login redirect.
 */
const AUTH_URL = "https://api.twitter.com/oauth/authenticate";

const ConnectTwitterButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleConnect = () => {
    setLoading(true);
    // Example: Replace with your registered app's request token
    // For real usage, the oauth_token must be obtained per-session via backend
    const oauth_token = ""; // Must be set, or explain further approach below

    // For demo: just send to Twitter login page
    // window.location.href = `${AUTH_URL}?oauth_token=${oauth_token}`;
    window.open("https://twitter.com/i/flow/login", "_blank"); // Opens Twitter login for demonstration
    setLoading(false);
  };

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-blue-500 to-sky-400 text-white w-full mt-2"
      disabled={loading}
    >
      <Twitter className="w-4 h-4 mr-2" />
      {loading ? "Connecting..." : "Connect Twitter"}
    </Button>
  );
};

export default ConnectTwitterButton;
