
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDeleteAccount = () => {
    // In a real app, this would involve more complex logic,
    // like deleting user data from Firestore and then deleting the user account.
    toast({
      title: "Account Deletion (Not Implemented)",
      description: "This feature is not yet implemented in this prototype.",
      variant: "default",
    });
  };

  if (!user) {
    return null; // Or a loading state, but AuthProvider handles this
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        <Separator />

        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} data-ai-hint="user avatar" />
                <AvatarFallback>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{user.displayName}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-medium">Theme</p>
              <ThemeToggle />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Select the color scheme for the application.
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone Section */}
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your resume data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </div>
            </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
