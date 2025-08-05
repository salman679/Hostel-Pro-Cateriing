import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Privacy() {
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
              Privacy Policy
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
                Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                At Hostel Pro, we take your privacy seriously. This Privacy
                Policy describes how we collect, use, and disclose your personal
                information when you use our website and services.
              </p>
              <p className="text-gray-600">
                By accessing or using Hostel Pro, you agree to the terms of this
                Privacy Policy. If you do not agree with our policies and
                practices, please do not use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                We collect several types of information from and about users of
                our website, including:
              </p>

              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
                Personal Information
              </h3>
              <p className="text-gray-600 mb-4">
                We may collect personal information that you provide directly to
                us, such as:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
                <li>
                  Name, email address, and contact information when you create
                  an account
                </li>
                <li>Payment information when you purchase a meal plan</li>
                <li>
                  Profile information, including your photo and preferences
                </li>
                <li>
                  Communications you send to us, such as customer service
                  inquiries
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
                Usage Information
              </h3>
              <p className="text-gray-600 mb-4">
                We automatically collect certain information about your device
                and how you interact with our services:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  Device information (browser type, operating system, device
                  type)
                </li>
                <li>
                  Log information (IP address, access times, pages viewed)
                </li>
                <li>Location information (if you enable location services)</li>
                <li>
                  Information about how you use our services (meal selections,
                  preferences)
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing transactions and sending related information</li>
                <li>
                  Sending administrative messages, updates, and promotional
                  materials
                </li>
                <li>Responding to your comments, questions, and requests</li>
                <li>Monitoring and analyzing trends, usage, and activities</li>
                <li>Personalizing your experience and content</li>
                <li>Protecting the security and integrity of our platform</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Sharing of Information
              </h2>
              <p className="text-gray-600 mb-4">
                We may share your personal information in the following
                circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  With service providers who perform services on our behalf
                </li>
                <li>
                  With analytics and advertising partners who help us understand
                  and improve our service
                </li>
                <li>
                  In connection with a business transaction (merger,
                  acquisition, or sale)
                </li>
                <li>To comply with legal obligations or protect rights</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to track
                activity on our website and collect certain information. Cookies
                are small data files stored on your device that help us improve
                our service and your experience.
              </p>
              <p className="text-gray-600 mb-4">
                You can set your browser to refuse all or some browser cookies,
                or to alert you when cookies are being sent. However, if you
                disable or refuse cookies, some parts of our website may not
                function properly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Rights and Choices
              </h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Access, update, or delete your personal information</li>
                <li>Object to our processing of your data</li>
                <li>Request restrictions on processing</li>
                <li>Data portability rights</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p className="text-gray-600 mt-4">
                To exercise these rights, please contact us using the
                information provided in the &quot;Contact Us&quot; section.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your
                personal information from accidental loss, unauthorized access,
                disclosure, alteration, and destruction. However, no method of
                transmission over the Internet or electronic storage is 100%
                secure.
              </p>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your
                account credentials and for any activities that occur under your
                account.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-gray-600">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If we learn we have collected personal
                information from a child under 13, we will delete that
                information promptly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Changes to Our Privacy Policy
              </h2>
              <p className="text-gray-600 mb-4">
                We may update our Privacy Policy from time to time. If we make
                material changes, we will notify you by email or through a
                notice on our website prior to the change becoming effective.
              </p>
              <p className="text-gray-600">
                We encourage you to review this Privacy Policy periodically to
                stay informed about how we are protecting your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us:
              </p>
              <ul className="list-none space-y-2 text-gray-600">
                <li>
                  <strong>Email:</strong> privacy@hostelpro.com
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
