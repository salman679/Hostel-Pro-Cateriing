import { Link } from "react-router-dom";
import { useAxiosPublic } from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Check, Star } from "lucide-react";

export default function Membership() {
  const axiosPublic = useAxiosPublic();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosPublic.get("/packages");
      return res.data;
    },
  });

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-50 rounded-full opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
            Meal Plans
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-green-500 rounded-full"></div>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your needs and enjoy hassle-free meals every
            day
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className={`rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl group ${
                  index === 1
                    ? "md:transform md:scale-105 shadow-lg border-green-500 border-2"
                    : "shadow-md border border-gray-100"
                }`}
              >
                <div
                  className={`p-6 sm:p-8 ${
                    index === 1
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"
                  }`}
                >
                  {index === 1 && (
                    <div className="flex justify-center mb-4">
                      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                    {pkg.name}
                  </h3>

                  <div className="flex items-end mb-4">
                    <span className="text-3xl sm:text-4xl font-bold">
                      ${pkg.price}
                    </span>
                    <span className="ml-1 text-sm opacity-80">
                      /{pkg.period}
                    </span>
                  </div>

                  {index === 1 && (
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-yellow-300 fill-yellow-300"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 bg-white">
                  <ul className="mb-8 space-y-4">
                    {pkg?.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div
                          className={`rounded-full p-1 mr-3 flex-shrink-0 ${
                            index === 1
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Check size={16} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/checkout/${pkg._id}`}
                    className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                      index === 1
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    Choose Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
