"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكنك إضافة منطق إرسال البيانات إلى السيرفر أو API
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>الدعم الفني</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="text-green-600 font-semibold text-center">
              شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">الاسم الكامل</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="اكتب اسمك الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 font-medium">البريد الإلكتروني</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-1 font-medium">رسالتك</label>
                <Textarea
                  id="message"
                  placeholder="اكتب استفسارك أو مشكلتك هنا"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                إرسال
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
