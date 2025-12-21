import { SignedIn, useUser } from "@clerk/clerk-react";
import React from "react";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

const App = () => {
  const { isLoaded } = useUser();
  // this will get rid of the flickering effect
  if (!isLoaded) return null;
  return (
    <>
      <SignedIn>
        <Navbar />
      </SignedIn>
      <Outlet />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
