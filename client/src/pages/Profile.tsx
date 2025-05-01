import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginWithGoogle, logoutUser, saveUserSettings, getUserSettings } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import GlassContainer from "@/components/GlassContainer";
import { User, Settings, LogOut, Bell, Moon, Lock, Key } from "lucide-react";

const Profile = () => {
  const { user, isLoading, setUserSettings, userSettings } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      setName(user.displayName || "");
      
      // Fetch user settings
      const fetchSettings = async () => {
        try {
          const settings = await getUserSettings(user.uid);
          if (settings) {
            setUserSettings(settings);
          }
        } catch (err) {
          console.error("Failed to fetch settings:", err);
        }
      };
      
      fetchSettings();
    }
  }, [isLoading, user, setUserSettings]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: "Success",
        description: "You are now logged in!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Success",
        description: "You have been logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await saveUserSettings(user.uid, {
        ...userSettings,
        name: name || user.displayName,
      });
      
      toast({
        title: "Success",
        description: "Your settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (setting: string, value: boolean) => {
    setUserSettings({
      ...userSettings,
      [setting]: value
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <GlassContainer className="max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold mb-6">Welcome to Super Assistant</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Sign in to access your personal productivity and lifestyle assistant.
          </p>
          <Button 
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            Sign in with Google
          </Button>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white dark:border-gray-800">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
          <AvatarFallback className="text-2xl">
            {user.displayName?.[0] || user.email?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{user.displayName || "User"}</h1>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email || ""}
                  disabled
                  placeholder="Your email"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Manage your app preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive push notifications
                  </div>
                </div>
                <Switch
                  checked={userSettings?.notifications ?? true}
                  onCheckedChange={(checked) => toggleSetting('notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Use dark theme
                  </div>
                </div>
                <Switch
                  checked={userSettings?.darkMode ?? false}
                  onCheckedChange={(checked) => toggleSetting('darkMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Data Sync</Label>
                  <div className="text-sm text-muted-foreground">
                    Sync data across devices
                  </div>
                </div>
                <Switch
                  checked={userSettings?.dataSync ?? true}
                  onCheckedChange={(checked) => toggleSetting('dataSync', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label>Password</Label>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Change Password
                </Button>
                <p className="text-xs text-muted-foreground">
                  Password management is handled by your Google account.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label>Two-Factor Authentication</Label>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Enable 2FA
                </Button>
                <p className="text-xs text-muted-foreground">
                  Two-factor authentication is managed by your Google account.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
