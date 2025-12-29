import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="space-y-6 text-slate-600">
      <p>
        This Privacy Policy describes how the "Service" (the budget-tracking application) collects,
        uses, discloses, and protects Personal Data when you use the Service. By accessing or
        using the Service you acknowledge that you have read and understood this Policy.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">1. Controller</h3>
      <p>
        For the purposes of applicable data protection laws, the operator of the Service is the
        Controller of Personal Data collected through the Service. Contact details for privacy
        inquiries are available at the end of this Policy.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">2. Categories of Personal Data Collected</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Account and authentication information (e.g., email, Google account identifier).</li>
        <li>Financial records entered by the user, including transactions, balances, categories, and notes.</li>
        <li>Usage data, diagnostics, and metadata (e.g., timestamps, IP addresses, device information).</li>
      </ul>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">3. Purposes and Legal Bases for Processing</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Provision and operation of the Service (performance of a contract with the user).</li>
        <li>Security, fraud prevention, and debugging (legitimate interests of the Controller).</li>
        <li>Compliance with legal obligations and protection of legal rights (legal obligation/legitimate interest).</li>
      </ul>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">4. Data Storage and Security</h3>
      <p>
        Personal Data collected by the Service is stored in Google Firestore. Reasonable
        administrative, technical, and physical safeguards are implemented to protect Personal
        Data against unauthorized access, disclosure, alteration, and destruction. However, no
        security measure is perfect; absolute security cannot be guaranteed.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">5. Disclosure and Third Parties</h3>
      <p>
        The Service may disclose Personal Data to third-party providers that perform services on
        behalf of the Controller (e.g., hosting, authentication). Such processors are contractually
        bound to process Personal Data only on documented instructions and to maintain appropriate
        safeguards.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">6. International Transfers</h3>
      <p>
        Personal Data may be processed and stored in countries outside your country of residence,
        including in the United States. Where required by law, transfers are subject to appropriate
        safeguards to ensure an adequate level of protection.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">7. Data Retention</h3>
      <p>
        Personal Data is retained only for as long as necessary to provide the Service, fulfill
        contractual and legal obligations, resolve disputes, and enforce agreements. Retention
        periods may vary by category of data and purpose of processing.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">8. Your Rights</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Access: You may request access to Personal Data we hold about you.</li>
        <li>Correction: You may request correction of inaccurate or incomplete data.</li>
        <li>Deletion: You may request deletion of your Personal Data, subject to legal limits.</li>
        <li>Restriction and objection: To the extent provided by law, you may request restriction
          of processing or object to processing.</li>
      </ul>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">9. Children</h3>
      <p>
        The Service is not intended for children under the age of 13. We do not knowingly collect
        Personal Data from children under 13. If we become aware that we have collected such data,
        we will take steps to delete it promptly.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">10. Changes to this Policy</h3>
      <p>
        We may update this Privacy Policy from time to time. We will post the updated Policy with
        an updated effective date. Continued use of the Service after changes indicates acceptance
        of the revised Policy.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mb-2">11. Contact</h3>
      <p>
        For privacy inquiries, data subject requests, or to lodge a complaint, please contact the
        Controller at the email address provided in the Service or repository documentation.
      </p>
    </div>
  );
}
