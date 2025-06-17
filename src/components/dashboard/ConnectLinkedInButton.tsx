
import React from "react";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

/**
 * Button that redirects user to LinkedIn's login page.
 * Note: For real OAuth, a backend is required.
 */
const LINKEDIN_LOGIN_URL = "https://www.linkedin.com/login";

const ConnectLinkedInButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleConnect = () => {
    setLoading(true);
    window.open(LINKEDIN_LOGIN_URL, "_blank"); // Open LinkedIn login page
    setLoading(false);
  };

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-blue-700 to-blue-500 text-white w-full mt-2"
      disabled={loading}
    >
      <Linkedin className="w-4 h-4 mr-2" />
      {loading ? "Connecting..." : "Connect LinkedIn"}
    </Button>
  );
};

export default ConnectLinkedInButton;
