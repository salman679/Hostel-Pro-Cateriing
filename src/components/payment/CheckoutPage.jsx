import { useNavigate, useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, CheckCircle, ArrowRight, User, Mail } from "lucide-react";

export default function CheckoutPage() {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  const { user } = useAuth();
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const { data: packageData = {}, isLoading: packageLoading } = useQuery({
    queryKey: ["packages", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/packages/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (packageData?.price) {
      axiosSecure
        .post("/create-payment-intent", {
          price: packageData.price,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          Swal.fire({
            icon: "error",
            title: "Payment Setup Failed",
            text: "There was an issue setting up the payment. Please try again.",
            confirmButtonColor: "#22c55e",
          });
        });
    }
  }, [packageData, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCardError("");

    if (!stripe || !elements) return;

    setIsProcessing(true);
    const card = elements.getElement(CardElement);

    if (!card) {
      setIsProcessing(false);
      setCardError("Please enter valid card details.");
      return;
    }

    try {
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (error) {
        setCardError(error.message);
        setIsProcessing(false);
        return;
      }

      // Confirm payment
      const { paymentIntent, error: paymentError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email,
              name: user?.displayName,
            },
          },
        });

      if (paymentError) {
        setCardError(paymentError.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        const payment = {
          price: packageData.price,
          subscription: packageData.name,
          transactionId: paymentIntent.id,
          email: user?.email,
          name: user?.displayName,
          date: new Date(),
          packageId: id,
        };

        await axiosSecure.post("/payments", payment).then((res) => {
          if (res.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              text: `You've successfully subscribed to the ${packageData.name} plan.`,
              confirmButtonColor: "#22c55e",
            });
            navigate("/");
          }
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (packageLoading) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageData || !packageData.name) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Package Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The package you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-500 rounded-full opacity-10"></div>
      <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-green-500 rounded-full opacity-10"></div>

      {/* Green header bar */}
      <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

      <div className="p-8">
        {/* Package Details */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {packageData.name} Plan
            </h2>
            <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {packageData.billingPeriod || "Monthly"}
            </div>
          </div>

          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${packageData.price}
            </span>
            <span className="text-gray-500 ml-1">
              /{packageData.period || "month"}
            </span>
          </div>

          {/* Package Features */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Plan Includes:</h3>
            <ul className="space-y-2">
              {packageData.features ? (
                packageData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-600">Premium hostel meal service</li>
              )}
            </ul>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span>{user?.displayName || "Guest User"}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{user?.email || "No email provided"}</span>
            </div>
          </div>

          {/* Card Element */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Information
            </label>
            <div className="p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all duration-200">
              <CardElement
                className="w-full"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>

            {/* Card Error Message */}
            {cardError && (
              <div className="text-red-500 text-sm flex items-center mt-2">
                <span className="mr-1">•</span> {cardError}
              </div>
            )}

            {/* Security Note */}
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <Shield className="h-3 w-3 mr-1" />
              <span>Your payment information is processed securely.</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || !elements || !clientSecret || isProcessing}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Complete Payment <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>

          {/* Test Card Info */}
          <div className="text-xs text-gray-500 text-center mt-4">
            <p>For testing, use card number: 4242 4242 4242 4242</p>
            <p>Exp: Any future date, CVC: Any 3 digits, ZIP: Any 5 digits</p>
          </div>
        </form>
      </div>
    </div>
  );
}
