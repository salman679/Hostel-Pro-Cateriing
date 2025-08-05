import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";

// Load stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(import.meta.env.VITE_Stripe_publishable_key);

// Custom appearance for Stripe Elements
const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#22c55e",
    colorBackground: "#ffffff",
    colorText: "#1f2937",
    colorDanger: "#ef4444",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    spacingUnit: "4px",
    borderRadius: "8px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    },
    ".Input:focus": {
      border: "1px solid #22c55e",
      boxShadow: "0 0 0 1px #22c55e",
    },
  },
};

// Options for Stripe Elements
const options = {
  appearance,
  locale: "en",
};

export default function Payment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Secure Payment</h1>
        <p className="mt-2 text-gray-600">
          Complete your subscription purchase
        </p>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutPage />
      </Elements>
    </div>
  );
}
