import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Terms() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-300">Last updated: March 30, 2024</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to Hostel Pro! These Terms of Service
                (&quot;Terms&quot;) govern your access to and use of the Hostel
                Pro website, mobile application, and services (collectively, the
                &quot;Service&quot;).
              </p>
              <p className="text-gray-600">
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of the Terms, you may
                not access the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Account Registration
              </h2>
              <p className="text-gray-600 mb-4">
                To use certain features of the Service, you may need to register
                for an account. When you register, you agree to provide
                accurate, current, and complete information about yourself.
              </p>
              <p className="text-gray-600 mb-4">
                You are responsible for safeguarding your account credentials
                and for all activities that occur under your account. You must
                notify us immediately of any unauthorized use of your account.
              </p>
              <p className="text-gray-600">
                We reserve the right to refuse service, terminate accounts,
                remove or edit content, or cancel orders at our sole discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Service Usage and Conduct
              </h2>
              <p className="text-gray-600 mb-4">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  Use the Service in any way that violates any applicable laws
                  or regulations
                </li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  misrepresent your affiliation
                </li>
                <li>
                  Engage in any conduct that restricts or inhibits anyone&apos;s
                  use of the Service
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service, accounts,
                  or computer systems
                </li>
                <li>
                  Use any automated means to access the Service without our
                  express written permission
                </li>
                <li>
                  Introduce any viruses, trojan horses, worms, or other harmful
                  material
                </li>
                <li>
                  Collect or harvest any information from the Service without
                  permission
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. User Content
              </h2>
              <p className="text-gray-600 mb-4">
                The Service allows you to post, link, store, share, and
                otherwise make available certain information, text, graphics,
                videos, or other material (&quot;User Content&quot;). You are
                responsible for all User Content that you upload, post, email,
                transmit, or otherwise make available via the Service.
              </p>
              <p className="text-gray-600 mb-4">
                By posting User Content, you grant us a worldwide,
                non-exclusive, royalty-free license to use, reproduce, modify,
                adapt, publish, translate, distribute, and display such content
                in connection with providing the Service.
              </p>
              <p className="text-gray-600">
                You represent and warrant that: (i) your User Content does not
                violate the rights of any third party and (ii) you have all
                necessary rights and permissions to grant the license above.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Payments and Subscriptions
              </h2>
              <p className="text-gray-600 mb-4">
                Certain aspects of the Service may be provided for a fee. You
                agree to pay all fees associated with your selected plan.
              </p>
              <p className="text-gray-600 mb-4">
                Unless otherwise stated, all fees are quoted in U.S. Dollars.
                You are responsible for paying all fees and applicable taxes in
                a timely manner with a valid payment method.
              </p>
              <p className="text-gray-600 mb-4">
                Subscription plans automatically renew until you cancel. You may
                cancel your subscription at any time, and your subscription will
                continue until the end of your billing cycle.
              </p>
              <p className="text-gray-600">
                We reserve the right to change our prices at any time. If we
                change pricing, we will provide notice of the change on the
                website or by email, at our option.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                The Service and its original content (excluding User Content),
                features, and functionality are and will remain the exclusive
                property of Hostel Pro and its licensors. The Service is
                protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-600">
                Our trademarks and trade dress may not be used in connection
                with any product or service without the prior written consent of
                Hostel Pro.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Termination
              </h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason, including if you breach these Terms.
              </p>
              <p className="text-gray-600">
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service or contact us to request account
                deletion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                In no event shall Hostel Pro, its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including loss of profits, data, or goodwill, resulting
                from your access to or use of or inability to access or use the
                Service.
              </p>
              <p className="text-gray-600">
                Some jurisdictions do not allow the exclusion or limitation of
                liability for consequential or incidental damages, so the above
                limitation may not apply to you.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                9. Disclaimer
              </h2>
              <p className="text-gray-600 mb-4">
                Your use of the Service is at your sole risk. The Service is
                provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
                basis. The Service is provided without warranties of any kind,
                whether express or implied, including, but not limited to,
                implied warranties of merchantability, fitness for a particular
                purpose, non-infringement, or course of performance.
              </p>
              <p className="text-gray-600">
                Hostel Pro does not warrant that the Service will be
                uninterrupted, timely, secure, or error-free, or that any errors
                in the Service will be corrected.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                10. Governing Law
              </h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and defined following the laws
                of the State of New York, without regard to its conflict of law
                provisions.
              </p>
              <p className="text-gray-600">
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights. If any
                provision of these Terms is held to be invalid or unenforceable,
                the remaining provisions will remain in effect.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify or replace these Terms at any
                time. We will provide notice of any changes by posting the new
                Terms on this page.
              </p>
              <p className="text-gray-600">
                You are advised to review these Terms periodically for any
                changes. Changes to these Terms are effective when they are
                posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none space-y-2 text-gray-600">
                <li>
                  <strong>Email:</strong> legal@hostelpro.com
                </li>
                <li>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </li>
                <li>
                  <strong>Mail:</strong> 123 University Ave, Campus Area, City,
                  State 12345
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
