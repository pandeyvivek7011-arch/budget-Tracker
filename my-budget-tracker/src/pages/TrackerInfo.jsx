import React from 'react';

export default function TrackerInfo() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to Budget Tracker</h2>
      <p className="text-slate-600">Take control of your finances through intuitive tracking and AI-powered insights.</p>
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">🚀 Key Features</h3>
      <ul className="list-disc pl-5 space-y-2 text-slate-600">
        <li><strong>Dashboard:</strong> Visual analytics.</li>
        <li><strong>Investments:</strong> AI-powered recommendations.</li>
        <li><strong>Transaction Log:</strong> Record earnings and expenses.</li>
        <li><strong>✨ Magic Add:</strong> Use AI to add transactions naturally.</li>
        <li><strong>Calculators:</strong> Tools for EMI, SIP, and Inflation.</li>
      </ul>
    </div>
  );
}
