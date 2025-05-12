import React from 'react';

const AlcoholFactsPage = () => {
  return (
    <main className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Basic Alcohol Facts: What Every Student Should Know</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">What Is a "Standard Drink"?</h2>
        <p className="mb-4">Not all drinks are created equal. A "standard" drink contains <strong>about 14 grams (0.6 oz) of pure alcohol</strong>.</p>
        <table className="w-full table-auto border border-gray-300 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Drink Type</th>
              <th className="border px-4 py-2 text-left">Serving Size</th>
              <th className="border px-4 py-2 text-left">Alcohol Content</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Beer</td>
              <td className="border px-4 py-2">12 oz (355 mL)</td>
              <td className="border px-4 py-2">~5% ABV</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Wine</td>
              <td className="border px-4 py-2">5 oz (148 mL)</td>
              <td className="border px-4 py-2">~12% ABV</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Hard Liquor</td>
              <td className="border px-4 py-2">1.5 oz (44 mL) shot</td>
              <td className="border px-4 py-2">~40% ABV (80 proof)</td>
            </tr>
          </tbody>
        </table>
        <p><strong>ABV</strong> = Alcohol by Volume</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How Much Is Too Much?</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Moderate drinking:</strong> Men: up to 2 drinks/day, Women: up to 1 drink/day</li>
          <li><strong>Binge drinking (unsafe):</strong> Men: 5+ drinks in ~2 hours, Women: 4+ drinks</li>
        </ul>
        <p className="text-red-600 font-medium">Alcohol poisoning can be fatal. Never leave someone passed out alone.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Beer vs. Wine vs. Liquor</h2>
        <table className="w-full table-auto border border-gray-300 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Factor</th>
              <th className="border px-4 py-2 text-left">Beer</th>
              <th className="border px-4 py-2 text-left">Wine</th>
              <th className="border px-4 py-2 text-left">Liquor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">ABV Range</td>
              <td className="border px-4 py-2">4–6%</td>
              <td className="border px-4 py-2">11–15%</td>
              <td className="border px-4 py-2">35–50%</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Serving Size</td>
              <td className="border px-4 py-2">12 oz</td>
              <td className="border px-4 py-2">5 oz</td>
              <td className="border px-4 py-2">1.5 oz</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Common Usage</td>
              <td className="border px-4 py-2">Social, casual</td>
              <td className="border px-4 py-2">Dinner, celebrations</td>
              <td className="border px-4 py-2">Shots, mixed drinks</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Risk Level</td>
              <td className="border px-4 py-2">Lower (per drink)</td>
              <td className="border px-4 py-2">Moderate</td>
              <td className="border px-4 py-2">Higher (easy to overconsume)</td>
            </tr>
          </tbody>
        </table>
        <p><strong>Liquor is small in volume but high in potency</strong> — easy to lose track of intake.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Tips for Safer Drinking</h2>
        <ul className="list-disc list-inside">
          <li>Eat first — food slows alcohol absorption.</li>
          <li>Drink water — alcohol dehydrates.</li>
          <li>Pace yourself — 1 drink per hour max.</li>
          <li>Don't mix with meds or energy drinks.</li>
          <li>Know your limits — and your friends’.</li>
        </ul>
      </section>

      <section className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="font-semibold">Just Because It's Legal Doesn't Mean It's Safe</p>
        <p className="mt-1">Many students feel pressure to drink — but you're not alone if you choose not to. <strong>Be smart, stay safe, and look out for each other.</strong></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Do Most Students Actually Drink?</h2>
        <p className="mb-2">Despite what you might hear, <strong>not all college students drink alcohol</strong> — and most who do, drink in moderation.</p>
        <ul className="list-disc list-inside">
          <li>According to national surveys, about <strong>40% of college students report drinking heavily</strong> in the past two weeks.</li>
          <li><strong>Nearly 1 in 4 students choose not to drink at all</strong>.</li>
          <li>Many overestimate how much their peers are drinking — it’s called the <em>“social norm misperception.”</em></li>
        </ul>
        <p className="mt-2"><strong>Bottom line:</strong> You’re not alone if you drink moderately, or not at all — and the healthiest choice is always the informed one.</p>
      </section>
    </main>
  );
};

export default AlcoholFactsPage;
