import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import AdminProfile from "../components/Dashboard/Admin/AdminProfile";
import ManageUsers from "../components/Dashboard/Admin/ManageUsers";
import AddMeal from "../components/Dashboard/Admin/AddMeal";
import AllMeals from "../components/Dashboard/Admin/AllMeals";
import AllReviews from "../components/Dashboard/Admin/AllReviews";
import Upcoming from "../components/Meals/Upcoming";
import DashboardLayout from "../layouts/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import MealDetail from "../components/Meals/Details";
import MealsPage from "../components/Meals/AllMeals";
import Payment from "../components/payment/Payment";
import UpcomingMeals from "../components/Dashboard/Admin/UpcomingMeals";
import AdminRoute from "./AdminRoute";
import UserProfile from "../components/Dashboard/User/UserProfile";
import RequestedMeals from "../components/Dashboard/User/RequestedMeals";
import Reviews from "../components/Dashboard/User/Reviews";
import PaymentHistory from "../components/Dashboard/User/PaymentHistory";
import Welcome from "../components/Dashboard/Welcome";
import ServeMeals from "../components/Dashboard/Admin/ServeMeals";
import ContactUs from "../pages/ContactUs";
import PrivacyPage from "../pages/PrivacyPage";
import Terms from "../pages/Terms";
import FAQ from "../pages/FAQ";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "meals",
        children: [
          {
            path: "",
            element: <MealsPage />,
          },
          {
            path: ":id",
            element: <MealDetail />,
          },
          {
            path: "upcoming-meals",
            element: <Upcoming />,
          },
        ],
      },
      {
        path: "checkout/:id",
        element: <Payment />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPage />,
      },
      {
        path: "terms-and-conditions",
        element: <Terms />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <SignUp />,
          },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Welcome />,
      },
      {
        path: "admin-profile",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "add-meal",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AddMeal />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "all-meals",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AllMeals />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "all-reviews",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AllReviews />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "upcoming-meals",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <UpcomingMeals />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "serve-meals",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ServeMeals />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "user-profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "requested-meals",
        element: (
          <PrivateRoute>
            <RequestedMeals />
          </PrivateRoute>
        ),
      },
      {
        path: "reviews",
        element: (
          <PrivateRoute>
            <Reviews />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <PrivateRoute>
            <PaymentHistory />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
