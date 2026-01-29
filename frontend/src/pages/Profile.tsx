import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Settings,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// ✅ Safe Supabase import
let supabase = null;
try {
  supabase = require("@/integrations/supabase/client").supabase;
} catch {
  console.warn("⚠️ Supabase not found — running in offline mode");
}

// ✅ Optional language context fallback
let useLanguage = () => ({ t: (key) => key });
try {
  useLanguage = require("@/contexts/LanguageContext").useLanguage;
} catch {
  console.warn("⚠️ LanguageContext not found — using fallback");
}

let LanguageSelector = () => null;
try {
  LanguageSelector = require("@/components/LanguageSelector").default;
} catch {
  console.warn("⚠️ LanguageSelector not found — skipped");
}

const Profile = () => {
  const { t } = useLanguage?.() || { t: (key) => key };
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    age: "",
    location_city: "",
    location_state: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // 🧩 Fallback (offline demo data)
      if (!supabase) {
        console.log("🧩 Using offline mode for profile demo");
        const guestData = {
          full_name: "Guest User",
          email: "guest@example.com",
          phone: "+91 98765 43210",
          age: 25,
          location_city: "Chennai",
          location_state: "Tamil Nadu",
          joined_date: new Date().toISOString(),
          total_listings: 3,
          active_listings: 2,
          total_sales: 1,
          rating: 4.6,
        };
        setUser({ email: guestData.email });
        setProfile(guestData);
        setFormData({
          full_name: guestData.full_name,
          phone: guestData.phone,
          age: guestData.age.toString(),
          location_city: guestData.location_city,
          location_state: guestData.location_state,
        });
        setLoading(false);
        return;
      }

      // 🧠 Online Mode
      const { data: authData } = await supabase.auth.getUser();
      const loggedUser = authData?.user;
      setUser(loggedUser);

      if (!loggedUser) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", loggedUser.id)
        .maybeSingle();

      const { data: listings } = await supabase
        .from("cattle_listings")
        .select("*")
        .eq("user_id", loggedUser.id);

      const profileObj = {
        id: loggedUser.id,
        email: loggedUser.email || "Not provided",
        full_name:
          profileData?.full_name ||
          loggedUser.user_metadata?.full_name ||
          "User",
        phone:
          profileData?.phone ||
          loggedUser.user_metadata?.phone ||
          "Not provided",
        age: profileData?.age || "",
        location_city: profileData?.location_city || "",
        location_state: profileData?.location_state || "",
        joined_date: loggedUser.created_at,
        total_listings: listings?.length || 0,
        active_listings:
          listings?.filter((l) => l.status === "active").length || 0,
        rating: 4.5,
        total_sales:
          listings?.filter((l) => l.status === "sold").length || 0,
      };

      setProfile(profileObj);
      setFormData({
        full_name: profileObj.full_name,
        phone: profileObj.phone,
        age: profileObj.age?.toString() || "",
        location_city: profileObj.location_city,
        location_state: profileObj.location_state,
      });
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!supabase || !user) {
      toast.error("Cannot save in offline mode");
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null,
          location_city: formData.location_city,
          location_state: formData.location_state,
        })
        .eq("id", user.id);

      if (error) throw error;

      setEditing(false);
      toast.success("Profile updated successfully");
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        phone: profile.phone,
        age: profile.age?.toString() || "",
        location_city: profile.location_city,
        location_state: profile.location_state,
      });
    }
    setEditing(false);
  };

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  // ❗ No user found
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <User className="h-10 w-10 mb-3 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">You’re not logged in.</p>
        <Button onClick={() => (window.location.href = "/auth")}>
          Go to Login
        </Button>
      </div>
    );
  }

  // ✅ Render Profile Page
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <User className="mr-3 h-8 w-8 text-primary" />
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings
            </p>
          </div>
          <LanguageSelector />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Personal Info</CardTitle>
              {!editing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { id: "full_name", label: "Full Name", icon: User },
                  { id: "email", label: "Email", icon: Mail },
                  { id: "phone", label: "Phone", icon: Phone },
                  { id: "age", label: "Age", icon: Calendar },
                  { id: "location_city", label: "City", icon: MapPin },
                  { id: "location_state", label: "State", icon: MapPin },
                ].map((field) => (
                  <div key={field.id}>
                    <Label>{field.label}</Label>
                    {editing && field.id !== "email" ? (
                      <Input
                        id={field.id}
                        type={field.id === "age" ? "number" : "text"}
                        value={formData[field.id] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.id]: e.target.value,
                          })
                        }
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <field.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {profile[field.id] ||
                            (field.id === "email"
                              ? user.email
                              : "Not set")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Member since{" "}
                {new Date(profile.joined_date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" /> Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {profile.rating}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Total Listings</span>
                  <Badge variant="secondary">{profile.total_listings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Listings</span>
                  <Badge>{profile.active_listings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sales</span>
                  <Badge variant="outline">{profile.total_sales}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" /> Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" /> Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
