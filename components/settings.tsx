"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Settings() {
  const [activeTab, setActiveTab] = useState("manual")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState("daily")

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Calorie & Nutrition Goals</CardTitle>
          <CardDescription>Set your daily calorie and macronutrient targets.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="calculate">Calculate BMR</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calorie Target</Label>
                <Input id="calories" type="number" placeholder="e.g., 2000" defaultValue="2000" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input id="protein" type="number" placeholder="e.g., 120" defaultValue="120" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" type="number" placeholder="e.g., 200" defaultValue="200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input id="fat" type="number" placeholder="e.g., 65" defaultValue="65" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calculate" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="e.g., 30" />
                </div>

                <div className="space-y-2">
                  <Label>Sex</Label>
                  <RadioGroup defaultValue="male" className="flex">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input id="weight" type="number" placeholder="e.g., 165" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (in)</Label>
                  <Input id="height" type="number" placeholder="e.g., 70" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very-active">Very active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full">Calculate BMR & Set Goals</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure your weight and nutrition reminders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Weight Reminder Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive reminders to log your weight.</p>
            </div>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          {notificationsEnabled && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Reminder Frequency</Label>
              <RadioGroup
                value={notificationFrequency}
                onValueChange={setNotificationFrequency}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

