'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a) || h <= 0 || w <= 0 || !activityLevel) {
      setBmi(null);
      setCategory('');
      setBmr(null);
      setTdee(null);
      setOpen(true);
      return;
    }

    // BMI
    const weightKg = w * 0.453592;
    const heightM = h * 0.0254;
    const heightCm = h * 2.54;
    const bmiValue = weightKg / (heightM * heightM);
    setBmi(bmiValue);
    setCategory(getBMICategory(bmiValue));

    // BMR
    let bmrValue: number;
    if (sex === 'male') {
      bmrValue = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
    } else {
      bmrValue = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
    }
    setBmr(bmrValue);

    // TDEE
    const activityMultiplier: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const tdeeValue = bmrValue * activityMultiplier[activityLevel];
    setTdee(tdeeValue);

    setOpen(true);
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4 p-4">
        <h2 className="text-xl font-semibold">Body Mass Index (BMI) and Caloric Calculator</h2>
        <p className="text-sm text-muted-foreground">
          Enter your details to calculate your BMI (Body Mass Index), BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure), 
          and daily calorie needs.
        </p>

        <div className="space-y-3">
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
                <input
                  type="radio"
                  name="sex"
                  value="male"
                  checked={sex === 'male'}
                  onChange={() => setSex('male')}
                />
                Male
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="sex"
                  value="female"
                  checked={sex === 'female'}
                  onChange={() => setSex('female')}
                />
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

          <Button onClick={calculate} className="w-full">
            Calculate BMI, BMR & TDEE
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Results</DialogTitle>
          </DialogHeader>

          <div className="text-sm space-y-3">
            <div className="border p-3 rounded bg-muted text-xs">
              <p className="font-semibold mb-1">BMI Categories:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Underweight = BMI &lt; 18.5</li>
                <li>Normal weight = 18.5–24.9</li>
                <li>Overweight = 25–29.9</li>
                <li>Obesity = 30 or greater</li>
              </ul>
            </div>

            {bmi !== null && bmr !== null && tdee !== null ? (
              <div className="space-y-2">
                <p>Your BMI is <strong>{bmi.toFixed(2)}</strong> — Category: <strong>{category}</strong></p>
                <p>Your BMR (resting calories burnt/day): <strong>{bmr.toFixed(0)}</strong></p>
                <p>Your TDEE (maintenance calories/day): <strong>{tdee.toFixed(0)}</strong></p>
              </div>
            ) : (
              <p className="text-red-600">Please enter valid values for all fields.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
