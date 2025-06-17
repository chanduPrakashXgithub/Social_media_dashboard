
import React from "react";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

/**
 * Button that redirects user to Instagram's login page.
 * Note: For real OAuth, a backend is required.
 */
const INSTAGRAM_LOGIN_URL = "https://www.instagram.com/accounts/login/";

const ConnectInstagramButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleConnect = () => {
    setLoading(true);
    window.open(INSTAGRAM_LOGIN_URL, "_blank"); // Open Instagram login page
    setLoading(false);
  };

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white w-full mt-2"
      disabled={loading}
    >
      <Instagram className="w-4 h-4 mr-2" />
      {loading ? "Connecting..." : "Connect Instagram"}
    </Button>
  );
};

export default ConnectInstagramButton;
