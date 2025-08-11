"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("ar");

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" /> الإعدادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* اللغة */}
          <div className="flex items-center justify-between">
            <Label>اللغة</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* الوضع الليلي */}
          <div className="flex items-center justify-between">
            <Label>الوضع الليلي</Label>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          {/* الإشعارات */}
          <div className="flex items-center justify-between">
            <Label>الإشعارات</Label>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
