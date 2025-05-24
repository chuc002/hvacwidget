import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-6">Last Updated: May 23, 2025</p>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to ServicePlan Pro ("we," "our," or "us"). We respect your privacy and are committed 
            to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our service subscription platform.
          </p>
          <p>
            By using ServicePlan Pro, you consent to the data practices described in this Privacy Policy. 
            If you do not agree with the data practices described, you should not use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-medium mt-4 mb-2">2.1 Personal Data</h3>
          <p>We may collect the following types of personal data:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Contact information (name, email address, phone number, company name)</li>
            <li>Account information (username, password)</li>
            <li>Billing information (billing address, payment method details)</li>
            <li>Subscription preferences and service plan details</li>
            <li>Communication and support requests</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-4 mb-2">2.2 Usage Data</h3>
          <p>We automatically collect certain information when you visit, use, or navigate our platform:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Device and connection information (IP address, browser type, operating system)</li>
            <li>Usage patterns and interactions with our platform</li>
            <li>Features used and subscription widget performance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing and managing your access to our platform</li>
            <li>Processing subscription transactions and payments</li>
            <li>Personalizing your experience and delivering content relevant to your interests</li>
            <li>Improving and developing our platform features</li>
            <li>Communicating with you about updates, security alerts, and support messages</li>
            <li>Analyzing usage patterns to enhance user experience</li>
            <li>Preventing fraudulent activity and securing our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service providers who perform services on our behalf (payment processors, hosting providers, analytics services)</li>
            <li>Business partners with your consent who offer services related to ours</li>
            <li>Legal and regulatory authorities when required by law</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures to protect your 
            personal data from unauthorized access, alteration, disclosure, or destruction. However, no 
            method of transmission over the internet or electronic storage is 100% secure, and we cannot 
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p>
            We will retain your personal data only for as long as necessary to fulfill the purposes for 
            which it was collected, including to satisfy any legal, regulatory, accounting, or reporting 
            requirements. When determining the appropriate retention period, we consider the amount, 
            nature, and sensitivity of the data, the potential risk of harm from unauthorized use or 
            disclosure, and the purposes for which we process the data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Data Protection Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate or incomplete data</li>
            <li>Erasure of your personal data</li>
            <li>Restriction of processing of your personal data</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
            <li>Withdrawal of consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the details provided in the "Contact Us" section.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. GDPR Compliance</h2>
          <p>
            For users in the European Economic Area (EEA), we process your personal data in accordance 
            with the General Data Protection Regulation (GDPR). The legal bases for processing include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Consent: When you explicitly agree to the processing of your data</li>
            <li>Contract: When processing is necessary for the performance of a contract with you</li>
            <li>Legitimate Interests: When processing is in our legitimate interests and not overridden by your rights</li>
            <li>Legal Obligation: When processing is necessary to comply with a legal obligation</li>
          </ul>
          <p>
            If you are in the EEA, you have the right to lodge a complaint with a data protection authority 
            if you believe our processing of your personal data violates applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect and store information when you use 
            our platform. These technologies may be used to remember your preferences, analyze trends, 
            administer the website, track users' movements around the website, and gather demographic 
            information about our user base as a whole.
          </p>
          <p>
            You can control cookies through your browser settings and other tools. However, if you block 
            certain cookies, you may not be able to use some features of our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
          <p>
            Our platform is not intended for children under the age of 16. We do not knowingly collect or 
            solicit personal information from children under 16. If we learn that we have collected personal 
            information from a child under 16, we will delete that information as quickly as possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by 
            an updated "Last Updated" date. We encourage you to review this Privacy Policy frequently to 
            stay informed about how we are protecting your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="mt-2">
            <p className="font-medium">Email: privacy@serviceplanpro.com</p>
            <p className="font-medium">Address: 123 Service Avenue, Suite 200, San Francisco, CA 94103</p>
          </div>
        </section>
      </div>
      
      <div className="mt-12 border-t pt-6">
        <Link href="/legal" className="text-primary hover:underline">
          Back to Legal Documents
        </Link>
      </div>
    </div>
  );
}