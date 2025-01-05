"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Chrome, Apple } from "lucide-react";

export default function InstallPage() {
  const platforms = {
    chrome: {
      title: "Chrome Installation",
      steps: [
        {
          title: "Open Chrome Menu",
          description: "Tap the three dots (⋮) in the upper right corner of your Chrome browser.",
          image: "/api/placeholder/600/400"
        },
        {
          title: "Find Install Option",
          description: "Look for 'Add to Home screen' or 'Install app' in the dropdown menu.",
          image: "/api/placeholder/600/400"
        },
        {
          title: "Customize Installation",
          description: "You can customize the app name that will appear on your home screen.",
          image: "/api/placeholder/600/400"
        },
        {
          title: "Confirm Installation",
          description: "Tap 'Add' or 'Install' to complete the process. The app icon will appear on your home screen.",
          image: "/api/placeholder/600/400"
        }
      ]
    },
    safari: {
      title: "Safari Installation",
      steps: [
        {
          title: "Open Share Menu",
          description: "Tap the Share button at the bottom of your Safari browser.",
          image: "/1st.png"
        },
        {
          title: "Find Home Screen Option",
          description: "Scroll through the share sheet and tap 'Add to Home Screen'.",
          image: "/2nd.png"
        },
        {
          title: "Complete Installation",
          description: "Tap 'Add' in the top right corner. The app will now appear on your home screen.",
          image: "/4th.png"
        }
      ]
    }
  };

  const [activeTab, setActiveTab] = useState('chrome');

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent) && !/OPR/i.test(userAgent)) {
      setActiveTab('chrome'); // Chrome-based browser
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
      setActiveTab('safari'); // Safari
    } else {
      setActiveTab('chrome'); // Default to Chrome if not detected
    }
  }, []);

  const chromeInstructions = platforms.chrome.steps.map((step, index) => (
    <Card key={index} className="overflow-hidden mb-4">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg text-red-600">{step.title}</h3>
        <p className="text-gray-700 mt-1">{step.description}</p>
        <img src={step.image} alt={step.title} className="rounded-lg shadow-md w-full" />
      </CardContent>
    </Card>
  ));

  const safariInstructions = platforms.safari.steps.map((step, index) => (
    <Card key={index} className="overflow-hidden mb-4">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg text-red-600">{step.title}</h3>
        <p className="text-gray-700 mt-1">{step.description}</p>
        <img src={step.image} alt={step.title} className="rounded-lg shadow-md w-full" />
      </CardContent>
    </Card>
  ));

  return (
    <div className="min-h-screen bg-gray-50 border-t md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center text-red-600">
              Install Our App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-6">
              Follow these simple steps to install our app on your device
            </p>
            
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="chrome" className="flex items-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Chrome
                </TabsTrigger>
                <TabsTrigger value="safari" className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  Safari
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chrome">
                <div className="space-y-8">
                  {chromeInstructions}
                </div>
              </TabsContent>
              <TabsContent value="safari">
                <div className="space-y-8">
                  {safariInstructions}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}