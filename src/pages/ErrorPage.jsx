import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>

        {/* Error Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        {/* Error Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 space-y-2">
          <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto"></div>
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto"></div>
          <div className="w-6 h-1 bg-gray-200 rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-green-500 rounded-full opacity-5"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-500 rounded-full opacity-5"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-5"></div>
      <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-green-500 rounded-full opacity-5"></div>
    </div>
  );
}
