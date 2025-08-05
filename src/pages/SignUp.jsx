import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { User, Mail, Lock, Image, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosPublic } from "../Hooks/useAxiosPublic";

export default function SignUp() {
  const { createUser, updateUser, signInWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
  });

  function validateForm(formData) {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.photo) newErrors.photo = "Photo URL is required";
    else if (!/^https?:\/\/.+/.test(formData.photo))
      newErrors.photo = "Please enter a valid URL";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target;
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      photo: form.photo.value.trim(),
      password: form.password.value.trim(),
    };

    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    // Reset errors
    setErrors({});

    createUser(formData.email, formData.password)
      .then(() => {
        const user = { displayName: formData.name, photoURL: formData.photo };
        // Update on Firebase
        updateUser(user)
          .then(() => {
            // Update on backend
            const newUser = {
              name: formData.name,
              email: formData.email,
              role: "user",
              image:
                formData.photo || "https://i.ibb.co.com/HBx04n5/images.jpg",
              subscription: "Bronze",
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            axiosPublic
              .post("/users", newUser)
              .then((res) => {
                if (res.data.insertedId) {
                  Swal.fire({
                    icon: "success",
                    title: "Welcome to Hostel Pro!",
                    text: "Your account has been created successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                    background: "#ffffff",
                    iconColor: "#22c55e",
                  });
                  form.reset();
                  navigate("/");
                }
              })
              .catch((error) => {
                console.error("Error adding user:", error);
                Swal.fire({
                  icon: "error",
                  title: "Registration Failed",
                  text: "There was an error creating your account. Please try again.",
                  confirmButtonColor: "#22c55e",
                });
              });
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            Swal.fire({
              icon: "error",
              title: "Profile Update Failed",
              text:
                error.message || "There was an error updating your profile.",
              confirmButtonColor: "#22c55e",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message || "There was an error creating your account.",
          confirmButtonColor: "#22c55e",
        });
      });
  }

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();

      const user = {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
        role: "user",
        subscription: "Bronze",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await axiosPublic.post("/users", user);

      Swal.fire({
        icon: "success",
        title: "Welcome to Hostel Pro!",
        text: "Your account has been created successfully with Google.",
        showConfirmButton: false,
        timer: 1500,
        background: "#ffffff",
        iconColor: "#22c55e",
      });

      navigate("/");
    } catch (error) {
      console.error("Error during Google login:", error);
      Swal.fire({
        icon: "error",
        title: "Google Sign Up Failed",
        text:
          error.message ||
          "There was an error creating your account with Google.",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-500 rounded-full opacity-10"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-green-500 rounded-full opacity-10"></div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Green header bar */}
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

          <div className="px-8 pt-8 pb-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Create Account
              </h1>
              <p className="mt-2 text-gray-600">
                Join Hostel Pro for delicious meals
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">•</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">•</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Photo URL Field */}
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Photo URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="photo"
                    name="photo"
                    placeholder="https://example.com/your-photo.jpg"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.photo ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.photo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">•</span> {errors.photo}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">•</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-green-600 hover:text-green-500">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-green-600 hover:text-green-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                {isLoading ? (
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
                ) : (
                  <span className="flex items-center">
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        // viewBox="0 0 24 24"
                      ></circle>
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
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path
                            fill="#4285F4"
                            d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                          />
                          <path
                            fill="#34A853"
                            d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                          />
                          <path
                            fill="#EA4335"
                            d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                          />
                        </g>
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200 "
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
