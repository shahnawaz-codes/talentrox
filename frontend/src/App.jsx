import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { Outlet } from "react-router";

const App = () => {
  return (
    <>
      
      <Outlet />
    </>
  );
};

export default App;
