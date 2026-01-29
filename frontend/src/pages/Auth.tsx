import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

let supabase = null;
try {
  supabase = require("@/integrations/supabase/client").supabase;
} catch {
  console.warn("⚠️ Supabase not found — running Auth page in demo mode");
}

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Offline demo mode
      if (!supabase) {
        console.log("🧩 Offline login simulation");
        toast.success("Logged in successfully (offline demo)");
        navigate("/dashboard");
        return;
      }

      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;

      toast.success(isLogin ? "Logged in successfully!" : "Account created!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex justify-center items-center">
            <LogIn className="mr-2" /> {isLogin ? "Sign In" : "Sign Up"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center border rounded-lg px-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 focus-visible:ring-0 flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center border rounded-lg px-2 mt-1">
                <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-0 focus-visible:ring-0 flex-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <Button
                variant="link"
                className="p-0 text-primary"
                type="button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
