import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">Your privacy is important to us. Data is stored securely in Google Firestore.</p>
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">Data Collection</h3>
      <ul className="list-disc pl-5 space-y-1 text-slate-600">
        <li>Financial transactions and budget data.</li>
        <li>Authentication data via Google Firebase.</li>
      </ul>
    </div>
  );
}
