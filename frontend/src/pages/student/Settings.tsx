"use client";

import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { User, Lock, Bell } from "lucide-react";

export default function Settings() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    gradeNotifications: true,
    announcements: true,
    emailDigest: false,
  });

  const handleProfileChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", formData);
    // TODO: Add API call to save profile
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Changing password");
    // TODO: Add API call to change password
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Profile Information
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Change Password
            </h2>

            <div className="space-y-6 ">
              <div>
                <Label htmlFor="currentPassword" className="text-foreground">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-foreground">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  className="mt-2"
                />
              </div>

              <Button onClick={handleChangePassword} className="w-full">
                Update Password
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Course Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about course changes and announcements
                  </p>
                </div>
                <Switch
                  checked={notifications.courseUpdates}
                  onCheckedChange={() =>
                    handleNotificationToggle("courseUpdates")
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Grade Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Notify me when grades are posted
                  </p>
                </div>
                <Switch
                  checked={notifications.gradeNotifications}
                  onCheckedChange={() =>
                    handleNotificationToggle("gradeNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Announcements</p>
                  <p className="text-sm text-muted-foreground">
                    Important announcements from school
                  </p>
                </div>
                <Switch
                  checked={notifications.announcements}
                  onCheckedChange={() =>
                    handleNotificationToggle("announcements")
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email Digest</p>
                  <p className="text-sm text-muted-foreground">
                    Weekly summary of your activity
                  </p>
                </div>
                <Switch
                  checked={notifications.emailDigest}
                  onCheckedChange={() =>
                    handleNotificationToggle("emailDigest")
                  }
                />
              </div>

              <Button className="w-full">Save Preferences</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
