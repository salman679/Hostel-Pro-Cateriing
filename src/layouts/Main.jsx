import { Outlet } from "react-router-dom";
import Footer from "../components/Sheard/Footer/Footer";
import Header from "../components/sheard/Header/Header";

export default function Main() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
