import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Checkout } from "./pages/checkout";
import { Demo } from "./pages/demo";
import { Register } from "./pages/register";
import { SingleVehicle } from "./pages/SingleVehicle";
import { Condiciones } from "./pages/condiciones";
import { PasswordReset } from "./pages/passwordReset";
import { PasswordUpdate } from "./pages/passwordUpdate";
import injectContext from "./store/appContext";
import { AppNavbar } from "./component/AppNavbar.jsx"; 
import { Footer } from "./component/footer";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <AppNavbar /> {/* Usa el nuevo Navbar */}
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Demo />} path="/demo" />
            <Route element={<Checkout />} path="/checkout" />
            <Route element={<SingleVehicle />} path="/vehicle/:id" />
            <Route element={<Register />} path="/register" />
            <Route element={<Condiciones />} path="/condiciones" />
            <Route element={<PasswordReset />} path="/reset-password" />
            <Route element={<PasswordUpdate />} path="/passwordupdate" />
            <Route element={<h1>Not found!</h1>} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
