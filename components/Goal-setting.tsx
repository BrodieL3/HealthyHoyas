'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');
  const [calories, setCalories] = useState<number | null>(null);
  const [macros, setMacros] = useState<{ protein: number; carbs: number; fat: number } | null>(null);
  const [manual, setManual] = useState<{ calories: string; protein: string; carbs: string; fat: string }>({ calories: '', protein: '', carbs: '', fat: '' });
  const [open, setOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualWarning, setManualWarning] = useState('');

  const activityMultiplier: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  useEffect(() => {
    const protein = parseInt(manual.protein) || 0;
    const carbs = parseInt(manual.carbs) || 0;
    const fat = parseInt(manual.fat) || 0;
    const calculatedCalories = protein * 4 + carbs * 4 + fat * 9;
    setManual((prev) => ({ ...prev, calories: calculatedCalories.toString() }));
  }, [manual.protein, manual.carbs, manual.fat]);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (isNaN(w) || isNaN(h) || isNaN(a) || !activityLevel) {
      setCalories(null);
      setMacros(null);
      setOpen(true);
      return;
    }

    const weightKg = w * 0.453592;
    const heightCm = h * 2.54;
    let bmrValue: number;
    if (sex === 'male') {
      bmrValue = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
    } else {
      bmrValue = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
    }

    const tdee = bmrValue * activityMultiplier[activityLevel];
    const goalFactor = goal === 'cut' ? 0.85 : goal === 'bulk' ? 1.15 : 1;
    const targetCalories = tdee * goalFactor;

    let proteinGramsRaw: number;
    let fatGramsRaw: number;

    if (goal === 'cut') {
      proteinGramsRaw = 1.2 * w;
      fatGramsRaw = 0.4 * w;
    } else if (goal === 'bulk') {
      proteinGramsRaw = 1.0 * w;
      fatGramsRaw = 0.5 * w;
    } else {
      proteinGramsRaw = 1.0 * w;
      fatGramsRaw = 0.4 * w;
    }

    const proteinCals = proteinGramsRaw * 4;
    const fatCals = fatGramsRaw * 9;
    const carbCals = Math.max(0, targetCalories - (proteinCals + fatCals));
    const carbGramsRaw = carbCals / 4;

    const proteinGrams = Math.round(proteinGramsRaw);
    const fatGrams = Math.round(fatGramsRaw);
    const carbGrams = Math.round(carbGramsRaw);

    const totalCalories = proteinGrams * 4 + fatGrams * 9 + carbGrams * 4;
    setCalories(totalCalories);
    setMacros({ protein: proteinGrams, carbs: carbGrams, fat: fatGrams });
    setOpen(true);
  };

  const COLORS = ['#82ca9d', '#8884d8', '#ffc658'];

  const chartData = macros
    ? [
        { name: 'Protein', value: macros.protein },
        { name: 'Carbs', value: macros.carbs },
        { name: 'Fat', value: macros.fat }
      ]
    : [];

  const manualChartData = [
    { name: 'Protein', value: parseInt(manual.protein) || 0 },
    { name: 'Carbs', value: parseInt(manual.carbs) || 0 },
    { name: 'Fat', value: parseInt(manual.fat) || 0 }
  ];

  const validateManualMacros = () => {
    const protein = parseInt(manual.protein) || 0;
    const carbs = parseInt(manual.carbs) || 0;
    const fat = parseInt(manual.fat) || 0;
    const totalCalories = parseInt(manual.calories) || 0;
    const calculated = protein * 4 + carbs * 4 + fat * 9;
    const difference = Math.abs(calculated - totalCalories);

    if (difference > 0) {
      setManualWarning(`Your macros add up to ${calculated} kcal, but your target is ${totalCalories} kcal. 
        Editing individual macros automatically readjusts the calories to the correct amount`);
    } else {
      setManualWarning('');
    }
    setManualOpen(true);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <h2 className="text-xl font-semibold">Calorie & Nutrition Goals</h2>
      <p className="text-sm text-muted-foreground">Set your daily calorie and macronutrient targets.</p>

      <Tabs defaultValue="manual">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="bmr">Assisted Macro Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <div className="space-y-3 mt-4">
            <Label>Daily Calorie Target</Label>
            <Input type="number" placeholder="e.g., 2000" value={manual.calories} onChange={e => setManual({ ...manual, calories: e.target.value })} />

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Protein (g)</Label>
                <Input type="number" value={manual.protein} onChange={e => setManual({ ...manual, protein: e.target.value })} />
              </div>
              <div>
                <Label>Carbs (g)</Label>
                <Input type="number" value={manual.carbs} onChange={e => setManual({ ...manual, carbs: e.target.value })} />
              </div>
              <div>
                <Label>Fat (g)</Label>
                <Input type="number" value={manual.fat} onChange={e => setManual({ ...manual, fat: e.target.value })} />
              </div>
            </div>

            <Button onClick={validateManualMacros} className="w-full mt-4">
              Preview Breakdown
            </Button>
          </div>
        </TabsContent>

        <Dialog open={manualOpen} onOpenChange={setManualOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Macro Breakdown</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                    {manualWarning && <p className="text-red-600 font-medium">{manualWarning}</p>}
                     <p>Entered calories: <strong>{manual.calories}</strong></p>
                    <ul className="list-disc list-inside">
                        <li>Protein: <strong>{manual.protein}g</strong></li>
                        <li>Carbs: <strong>{manual.carbs}g</strong></li>
                        <li>Fat: <strong>{manual.fat}g</strong></li>
                    </ul>
                    <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={manualChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}g`}
                        >
                        {manualChartData.map((entry, index) => (
                        <Cell key={`manual-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}g`} />
                    </PieChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </DialogContent>
        </Dialog>


        <TabsContent value="bmr">
          <div className="space-y-3 mt-4">
            <div>
              <Label>Weight (lbs)</Label>
              <Input type="number" placeholder="e.g., 165" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>

            <div>
              <Label>Height (in)</Label>
              <Input type="number" placeholder="e.g., 70" value={height} onChange={e => setHeight(e.target.value)} />
            </div>

            <div>
              <Label>Age</Label>
              <Input type="number" placeholder="e.g., 30" value={age} onChange={e => setAge(e.target.value)} />
            </div>

            <div>
              <Label>Sex</Label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1">
                  <input type="radio" name="sex" value="male" checked={sex === 'male'} onChange={() => setSex('male')} />
                  Male
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="sex" value="female" checked={sex === 'female'} onChange={() => setSex('female')} />
                  Female
                </label>
              </div>
            </div>

            <div>
              <Label>Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (1–3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3–5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6–7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (physical job + exercise)</SelectItem>
                    </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Goal</Label>
              <Select value={goal} onValueChange={(v) => setGoal(v as typeof goal)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cut">Cut (Fat Loss)</SelectItem>
                  <SelectItem value="maintain">Maintain</SelectItem>
                  <SelectItem value="bulk">Bulk (Muscle Gain)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate Macros
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Macronutrient Breakdown</DialogTitle>
          </DialogHeader>

          {calories !== null && macros !== null ? (
            <div className="space-y-3 text-sm">
              <p>Estimated daily calories: <strong>{calories.toFixed(0)}</strong></p>
              <ul className="list-disc list-inside">
                <li>Protein: <strong>{macros.protein}g</strong></li>
                <li>Carbs: <strong>{macros.carbs}g</strong></li>
                <li>Fat: <strong>{macros.fat}g</strong></li>
              </ul>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}g`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-red-600">Please enter valid information.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
