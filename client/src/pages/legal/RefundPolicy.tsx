import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <p className="text-gray-500 mb-6">Last Updated: May 23, 2025</p>
      
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            This Refund Policy outlines the terms and conditions regarding refunds for subscription 
            fees paid to ServicePlan Pro. We strive to provide excellent service, but we understand 
            that there may be situations where a refund is appropriate.
          </p>
          <p>
            By using our services, you agree to the terms of this Refund Policy. Please read this 
            policy carefully before subscribing to any of our plans.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Subscription Fees</h2>
          <p>
            ServicePlan Pro offers various subscription plans that are billed on a monthly or annual 
            basis, as selected by you during the signup process. Subscription fees are charged in 
            advance for each billing period.
          </p>
          <p>
            All payments are processed securely through our payment processor, Stripe. We do not 
            store your complete credit card information on our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Refund Eligibility</h2>
          
          <h3 className="text-xl font-medium mt-4 mb-2">3.1 14-Day Satisfaction Guarantee</h3>
          <p>
            For new customers, we offer a 14-day satisfaction guarantee. If you are not satisfied 
            with our service within the first 14 days of your initial subscription, you may request 
            a full refund of your subscription fee.
          </p>
          <p>
            To qualify for this refund, you must:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Request the refund within 14 days of your initial payment</li>
            <li>Provide a reason for your dissatisfaction to help us improve our service</li>
            <li>Have not violated our Terms of Service</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-4 mb-2">3.2 Service Disruption</h3>
          <p>
            If ServicePlan Pro experiences a significant service disruption that lasts more than 24 
            consecutive hours, you may be eligible for a prorated refund or credit for the affected 
            period. The decision to issue a refund or credit in this situation is at our discretion 
            and will be based on the nature and severity of the disruption.
          </p>
          
          <h3 className="text-xl font-medium mt-4 mb-2">3.3 Billing Errors</h3>
          <p>
            If you have been charged incorrectly due to a billing error on our part, you will be 
            eligible for a full refund of the overcharged amount. Please contact us as soon as 
            possible if you believe you have been charged incorrectly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Non-Refundable Situations</h2>
          <p>
            Refunds will generally not be provided in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>After the 14-day satisfaction guarantee period has expired</li>
            <li>For partial months or unused portion of a subscription period after cancellation</li>
            <li>If you have violated our Terms of Service</li>
            <li>For feature requests or functionality that was clearly documented as not being part of the service</li>
            <li>Due to incompatibility with your systems or third-party services not expressly supported by ServicePlan Pro</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cancellation Policy</h2>
          <p>
            You may cancel your subscription at any time through your account dashboard or by 
            contacting our support team. Upon cancellation:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your subscription will remain active until the end of your current billing period</li>
            <li>You will not receive a refund for the remaining days in your current billing period</li>
            <li>You will not be charged for any subsequent billing periods</li>
            <li>Your access to the service will terminate at the end of your current billing period</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team by:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: support@serviceplanpro.com</li>
            <li>Support ticket: Submit a ticket through your account dashboard</li>
            <li>Contact form: Available on our website at www.serviceplanpro.com/contact</li>
          </ul>
          <p>
            Please include the following information in your refund request:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your account email address</li>
            <li>Date of payment</li>
            <li>Amount paid</li>
            <li>Reason for requesting a refund</li>
            <li>Any relevant order or transaction IDs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Refund Processing</h2>
          <p>
            Once your refund request is approved:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>We will process the refund within 5-10 business days</li>
            <li>The refund will be issued to the original payment method used for the purchase</li>
            <li>Depending on your payment provider, it may take additional time for the refund to appear in your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
          <p>
            We reserve the right to modify this Refund Policy at any time. If we make material 
            changes to this policy, we will notify you by email or by posting a notice on our website 
            prior to the changes becoming effective. Your continued use of our service after the 
            effective date of such changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Refund Policy, please contact us at:
          </p>
          <div className="mt-2">
            <p className="font-medium">Email: billing@serviceplanpro.com</p>
            <p className="font-medium">Phone: (800) 123-4567</p>
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