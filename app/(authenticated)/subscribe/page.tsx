"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch subscription status from API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/subscription");
        const data = await res.json();
        setSubscribed(data.isSubscribed);
      } catch (err: any) {
        setError("Could not check subscription status");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Subscribe handler
  const handleSubscribe = async () => {
    try {
      setSubscribeLoading(true);
      setError("");
      const res = await fetch("/api/subscription", { method: "POST" });
      if (!res.ok) throw new Error("Subscription failed");
      setSubscribed(true);
    } catch (err: any) {
      setError(err.message || "Unable to subscribe");
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="w-full max-w-md bg-gray-900/80 p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">TodoMaster Pro Subscription</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Unlock premium features and maximize your productivity!
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-blue-400" />
          </div>
        ) : subscribed ? (
          <Badge className="bg-green-600/20 text-green-400 border-green-600/30 px-6 py-3 text-lg">
            Pro Member
          </Badge>
        ) : (
          <Button
            className="my-2 w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            onClick={handleSubscribe}
            disabled={subscribeLoading}
          >
            {subscribeLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Subscribing...
              </>
            ) : (
              "Subscribe Now"
            )}
          </Button>
        )}

        {subscribed && (
          <Button
            variant="outline"
            className="mt-5 w-full text-gray-200 border-gray-700 hover:bg-gray-800"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
