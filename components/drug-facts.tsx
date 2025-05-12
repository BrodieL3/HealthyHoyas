import React from 'react';

const DrugAwarenessPage = () => {
  return (
    <main className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Substance Awareness: What Every Student Should Know</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Common Substances on Campuses</h2>
        <p className="mb-4">Here are some of the most commonly encountered substances among students. Each comes with different effects, risks, and safety considerations:</p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Cocaine</strong>: A stimulant that can cause increased heart rate, anxiety, and aggression. Risk of overdose and heart complications. Often cut with other dangerous substances.
          </li>
          <li>
            <strong>Adderall (non-prescribed)</strong>: A stimulant meant for ADHD treatment. Misuse can lead to heart issues, sleep disruption, and dependence.
          </li>
          <li>
            <strong>Xanax (Alprazolam)</strong>: A benzodiazepine for anxiety. Mixing with alcohol or other depressants increases risk of overdose and blackouts.
          </li>
          <li>
            <strong>Fentanyl</strong>: A synthetic opioid 50–100x stronger than morphine. Often found in counterfeit pills or mixed into other drugs — even tiny amounts can be fatal.
          </li>
          <li>
            <strong>Weed (Cannabis)</strong>: Can cause relaxation, but also anxiety or paranoia in high doses. Impairs short-term memory and motor function. Legal status varies by state and campus.
          </li>
          <li>
            <strong>Psychedelics (LSD, psilocybin, etc.)</strong>: Hallucinogens that alter perception and mood. May cause profound experiences but also confusion, anxiety, or panic. Not typically addictive, but effects vary greatly by mindset, dose, and setting. Never mix with other substances.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Harm Reduction Tips</h2>
        <ul className="list-disc list-inside">
          <li>Never use alone — have a trusted friend nearby.</li>
          <li>Test your substances using drug checking kits (especially with pills or powders).</li>
          <li>Start with a very small amount — strength and contents are unpredictable.</li>
          <li>Don’t mix substances (e.g., Xanax and alcohol).</li>
          <li>Take breaks and stay hydrated.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Where to Get Drug Testing Kits</h2>
        <ul className="list-disc list-inside">
          <li>Check if your campus health center provides fentanyl or multi-drug test strips.</li>
          <li>Order from harm reduction nonprofits like <a href="https://dancesafe.org" className="text-blue-600 underline" target="_blank">DanceSafe</a> or <a href="https://nextdistro.org" className="text-blue-600 underline" target="_blank">NEXT Distro</a>.</li>
          <li>Some cities and counties offer free kits through public health programs.</li>
        </ul>
        <p className="mt-2">Test strips are legal in most states and can detect fentanyl or other adulterants in pills, powders, or blotters.</p>
      </section>

      <section className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="font-semibold">Safety Over Judgment</p>
        <p className="mt-1">This isn’t about encouraging drug use — it’s about being safe, informed, and prepared. Even one decision can save a life.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Myths vs. Reality</h2>
        <ul className="list-disc list-inside">
          <li><strong>Myth:</strong> "Prescription drugs are safe to share." <br /><strong>Reality:</strong> Misusing prescriptions can be as dangerous as street drugs, especially when mixed.</li>
          <li><strong>Myth:</strong> "You can tell if something contains fentanyl by looking." <br /><strong>Reality:</strong> You can’t — always test.</li>
          <li><strong>Myth:</strong> "Everyone’s doing it." <br /><strong>Reality:</strong> Most students either don’t use or use infrequently.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Final Thoughts</h2>
        <p>You’re not alone in making cautious, informed choices. Whether you abstain or participate, your safety and awareness matter most. Know the facts, protect your friends, and don’t hesitate to ask for help if needed.</p>
      </section>
    </main>
  );
};

export default DrugAwarenessPage;
