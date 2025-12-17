import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
