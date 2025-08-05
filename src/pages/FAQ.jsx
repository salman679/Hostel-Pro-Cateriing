import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openQuestions, setOpenQuestions] = useState([]);

  // List of categories
  const categories = [
    { id: "all", name: "All Questions" },
    { id: "account", name: "Account & Billing" },
    { id: "meals", name: "Meals & Nutrition" },
    { id: "plans", name: "Subscription Plans" },
    { id: "technical", name: "Technical Support" },
  ];

  // FAQ data
  const faqData = [
    {
      id: 1,
      category: "account",
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Join Us' button in the top right corner of the homepage. You will need to provide your name, email address, and a password. You can also sign up using your Google account for faster registration.",
    },
    {
      id: 2,
      category: "account",
      question: "How do I reset my password?",
      answer:
        "If you forgot your password, click on the 'Login' button and then select 'Forgot password?'. Enter the email address associated with your account, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    },
    {
      id: 3,
      category: "account",
      question: "Can I change my email address?",
      answer:
        "Yes, you can change your email address in your account settings. Log in to your account, navigate to the profile section, and update your email address. You will need to verify the new email address before the change takes effect.",
    },
    {
      id: 4,
      category: "meals",
      question: "What meal options are available?",
      answer:
        "We offer a variety of meal options including breakfast, lunch, and dinner. Our menu includes vegetarian, vegan, and gluten-free options. You can view the full menu in the 'Meals' section of our website, where you can filter by meal type, dietary restrictions, and more.",
    },
    {
      id: 5,
      category: "meals",
      question: "How do I specify dietary restrictions?",
      answer:
        "You can specify your dietary restrictions in your profile settings. Once set, our system will highlight meals that match your preferences and filter out those that don't meet your requirements. You can update these preferences at any time.",
    },
    {
      id: 6,
      category: "meals",
      question: "How fresh are your meals?",
      answer:
        "All our meals are prepared fresh daily by our team of chefs. We use locally-sourced ingredients whenever possible to ensure the highest quality and freshness. Meals are delivered to the hostel dining areas shortly before serving times.",
    },
    {
      id: 7,
      category: "plans",
      question: "What subscription plans do you offer?",
      answer:
        "We offer several subscription plans including Basic, Standard, and Premium. Each plan offers different features and benefits, such as the number of meals per day, access to premium menu items, and guest meal options. You can compare all plans on our 'Meal Plans' page.",
    },
    {
      id: 8,
      category: "plans",
      question: "How do I upgrade or downgrade my plan?",
      answer:
        "You can change your subscription plan at any time through your account dashboard. Navigate to the 'Subscription' section, select 'Change Plan', and choose your new plan. Changes will take effect at the start of your next billing cycle.",
    },
    {
      id: 9,
      category: "plans",
      question: "Is there a refund policy?",
      answer:
        "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied with our service, you can request a refund within 7 days of your initial subscription. For existing subscribers, we generally don't provide refunds for partial billing periods, but you can downgrade or cancel your plan at any time.",
    },
    {
      id: 10,
      category: "technical",
      question: "The website isn't loading correctly. What should I do?",
      answer:
        "First, try refreshing the page or clearing your browser cache. If that doesn't work, try using a different browser or device. If you're still experiencing issues, please contact our support team with details about the problem, including what device and browser you're using.",
    },
    {
      id: 11,
      category: "technical",
      question: "How do I report a bug or technical issue?",
      answer:
        "You can report bugs or technical issues through the 'Contact Us' page on our website. Please include as much detail as possible, such as what you were doing when the issue occurred, any error messages you received, and what device and browser you're using. Screenshots are also helpful.",
    },
    {
      id: 12,
      category: "account",
      question: "How do I cancel my subscription?",
      answer:
        "To cancel your subscription, log in to your account, go to the 'Subscription' section in your dashboard, and select 'Cancel Subscription'. Follow the prompts to complete the cancellation process. Your subscription will remain active until the end of your current billing period.",
    },
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle question toggle
  const toggleQuestion = (id) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter((questionId) => questionId !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Highlight matched text
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-gray-800 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Find answers to the most common questions about Hostel Pro
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full px-5 py-3 pl-12 pr-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />

              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-center text-gray-600 mb-8">
            Found {filteredFAQs.length} result
            {filteredFAQs.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className={`w-full text-left p-5 flex justify-between items-center ${
                    openQuestions.includes(faq.id) ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <h3 className="font-medium text-gray-800 pr-4">
                    {searchQuery
                      ? highlightMatch(faq.question, searchQuery)
                      : faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openQuestions.includes(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {openQuestions.includes(faq.id) && (
                  <div className="px-5 pb-5 text-gray-600 animate-fadeIn">
                    <div className="pt-2 border-t border-gray-200">
                      {searchQuery
                        ? highlightMatch(faq.answer, searchQuery)
                        : faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-500 mb-6">
                We couldn&apos;t find any FAQ that matches your search criteria.
              </p>
              <button
                onClick={clearSearch}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Couldn&apos;t Find Your Answer?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you couldn&apos;t find the answer you&apos;re looking for, our
            support team is here to help.
          </p>
          <Link
            to="/contact-us"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
