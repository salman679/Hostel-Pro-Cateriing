import { ArrowRight } from "lucide-react";
import SpecialOffer from "../../assets/SpecialOffers.webp";

export default function SpecialOffers() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
            Today&apos;s Special
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-green-500 rounded-full"></div>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Limited time offers you don&apos;t want to miss
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-[1.02] group">
              <img
                src={SpecialOffer || "/placeholder.svg"}
                alt="Weekend Brunch Special"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Limited Time
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Decorative element */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-green-50 rounded-full opacity-50"></div>

              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                Weekend Brunch Special
              </h3>

              <p className="text-gray-600 mb-6 relative z-10">
                Enjoy our exclusive weekend brunch menu featuring a variety of
                international cuisines, freshly baked pastries, and refreshing
                beverages. Perfect for a relaxing weekend morning with friends
                or family.
              </p>

              <div className="bg-gray-50 p-5 rounded-xl mb-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span>Available every Saturday and Sunday</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span>9:00 AM to 1:00 PM</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span>Special price: $15.99 per person</span>
                  </li>
                </ul>
              </div>

              <button className="flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors">
                Reserve Now
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
